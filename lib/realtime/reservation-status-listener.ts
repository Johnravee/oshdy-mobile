import { supabase } from '@/lib/supabase';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { logError, logInfo } from '@/utils/logger';
import { getReservationFullJoinInformation } from '@/lib/api/getReservationFullJoin';

let channelActive: ReturnType<typeof supabase.channel> | null = null;
let currentProfileId: number | null = null;

async function ensureChannel() {
  try {
    await notifee.createChannel({
      id: 'oshdy-default',
      name: 'OSHDY Notifications',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });
  } catch (e) {
    // ignore
  }
}

function normalizeStatus(s: string) {
  return s === 'contractsigning' ? 'contract_signing' : s.replace(/\s+/g, '_');
}

export function startReservationStatusListener(profileId: number) {
  if (!profileId) return;
  if (currentProfileId === profileId && channelActive) {
    return; // already listening for this profile
  }

  // Clean up previous channel if any
  if (channelActive) {
    try { supabase.removeChannel(channelActive); } catch {}
    channelActive = null;
  }

  currentProfileId = profileId;
  logInfo('🔄 Realtime → Subscribing to reservation updates for profile:', profileId);

  channelActive = supabase
    .channel('public:reservations-global')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'reservations',
        filter: `profile_id=eq.${profileId}`,
      },
      async (payload) => {
        try {
          const newStatus = String(payload.new?.status || '').toLowerCase();
          const oldStatus = String(payload.old?.status || '').toLowerCase();

          if (normalizeStatus(newStatus) === normalizeStatus(oldStatus)) return;

          await ensureChannel();

          const title = payload.new?.receipt_number
            ? `Reservation ${payload.new.receipt_number} updated`
            : `Reservation #${payload.new?.id} updated`;

          let pkgName: string | undefined;
          let eventDateStr: string | undefined;
          const reservationId = payload.new?.id;
          if (reservationId) {
            try {
              const full = await getReservationFullJoinInformation(reservationId, profileId);
              const res = Array.isArray(full) && full.length ? full[0] : (full as any)?.[0] ?? (full as any);
              if (res) {
                if (res.packages) {
                  pkgName = Array.isArray(res.packages) ? res.packages[0]?.name : res.packages?.name;
                }
                if (res.event_date) eventDateStr = String(res.event_date);
              }
            } catch (e) {
              // ignore
            }
          }

          if (!pkgName) pkgName = (payload.new as any)?.pkg?.name ?? (payload.new as any)?.package_name ?? 'N/A';
          if (!eventDateStr) eventDateStr = (payload.new as any)?.event_date ?? (payload.new as any)?.eventDate;

          const formattedDate = eventDateStr ? new Date(eventDateStr).toLocaleDateString() : 'N/A';
          const body = `Status: ${String(payload.new?.status || '')} • Package: ${pkgName} • Date: ${formattedDate}`;

          await notifee.displayNotification({
            title,
            body,
            android: {
              channelId: 'oshdy-default',
              smallIcon: 'ic_launcher',
              importance: AndroidImportance.HIGH,
              vibrationPattern: [300, 150, 300, 150],
              sound: 'default',
              pressAction: { id: 'default', launchActivity: 'default' },
            },
            ios: { sound: 'default' },
          });
        } catch (err) {
          logError('Realtime → Notification error', err);
        }
      }
    )
    .subscribe();
}

export function stopReservationStatusListener() {
  if (channelActive) {
    try { supabase.removeChannel(channelActive); } catch {}
    channelActive = null;
    currentProfileId = null;
  }
}