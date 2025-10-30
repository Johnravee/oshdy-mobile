import { View, ScrollView, Text } from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import notifee, { AndroidImportance } from '@notifee/react-native'
import { supabase } from '@/lib/supabase'
import { getReservationFullJoinInformation } from '@/lib/api/getReservationFullJoin'
import AnimatedModal from '@/components/ui/animatedModal'
import assistAnim from '@/assets/images/lottie/assist.json'
import { useRouter } from 'expo-router'
import StatusSummary from '@/components/ui/statusSummary'
import { IMAGES } from '@/constants/Images'
import UserEventShortcuts from '@/components/ui/UserEventShortcuts'
import Banner from '@/components/ui/banner'
import HorizontalCarousel from '@/components/ui/HorizontalCarousel'
import DashboardHeader from '@/components/ui/dashboardHeader'
import { useCompletedReservationCount } from '@/hooks/useCompletedReservation'
import { usePendingReservationCount } from '@/hooks/usePendingReservationCount'
import { useCanceledReservationCount } from '@/hooks/useCanceledReservationCount'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useProfileContext } from '@/context/ProfileContext'


// Normalize DB variant for reservation status
function normalizeStatus(s: string) {
  return s === 'contractsigning' ? 'contract_signing' : s.replace(/\s+/g, '_');
}

export default function Dashboard() {
  const router = useRouter();
  const { profile } = useProfileContext();
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [recentDoneReservation, setRecentDoneReservation] = useState<any>(null);
  const promptedRef = useRef<Set<number>>(new Set());
  const channelIdRef = useRef<string | null>(null);
  const { totalCount } = useCompletedReservationCount();
  const { pendingCount } = usePendingReservationCount();
  const { canceledCount } = useCanceledReservationCount();
  const [menuLoading, setMenuLoading] = useState(true);
  const [designLoading, setDesignLoading] = useState(true);

  useEffect(() => {
  if (!profile) {
    router.replace("/(app)/onboarding");
  }
}, [profile]);

  // simulate initial loading for carousels (replace with real fetch loading flags if needed)
  useEffect(() => {
    const t1 = setTimeout(() => setMenuLoading(false), 600);
    const t2 = setTimeout(() => setDesignLoading(false), 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Setup local notification channel and request permissions
  useEffect(() => {
    async function setupNotifications() {
      try {
        const id = await notifee.createChannel({
          id: 'oshdy-default',
          name: 'OSHDY Notifications',
          importance: AndroidImportance.HIGH,
          vibration: true,
          sound: 'default',
        });
        channelIdRef.current = id;
        const perm = await notifee.requestPermission();
        console.log('[Dashboard] notifee permission', perm);
      } catch (err) {
        console.warn('[Dashboard] notifee setup error', err);
      }
    }
    setupNotifications();
  }, []);

  // Subscribe to reservation 
  useEffect(() => {
    if (!profile?.id) return;

    const channel = supabase
      .channel('public:reservations-feedback')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'reservations',
          filter: `profile_id=eq.${profile.id}`,
        },
            (payload) => {
              try {
                  const newStatus = String(payload.new?.status || '').toLowerCase();
                  const oldStatus = String(payload.old?.status || '').toLowerCase();
                  // once-per-session: show feedback modal when reservation becomes Done
                  if (normalizeStatus(newStatus) === 'done' && normalizeStatus(oldStatus) !== 'done') {
                    const reservationId = payload.new?.id;
                    if (reservationId && !promptedRef.current.has(reservationId)) {
                      promptedRef.current.add(reservationId);
                      setRecentDoneReservation(payload.new);
                      setShowFeedbackPrompt(true);
                    }
                  }

                  // show local notification when status changed
                  if (normalizeStatus(newStatus) !== normalizeStatus(oldStatus)) {
                    ;(async () => {
                      try {
                        const title = payload.new?.receipt_number
                          ? `Reservation ${payload.new.receipt_number} updated`
                          : `Reservation #${payload.new?.id} updated`;

                        // Try to fetch the full reservation (to get package and date)
                        let pkgName: string | undefined
                        let eventDateStr: string | undefined
                        const reservationId = payload.new?.id
                        if (reservationId && profile?.id) {
                          const full = await getReservationFullJoinInformation(reservationId, profile.id)
                          const res = Array.isArray(full) && full.length ? full[0] : full?.[0] ?? full
                          if (res) {
                            // packages can be object or array depending on join
                            if (res.packages) {
                              if (Array.isArray(res.packages)) pkgName = res.packages[0]?.name
                              else pkgName = res.packages?.name
                            }
                            if (res.event_date) eventDateStr = String(res.event_date)
                          }
                        }

                        // fallback to payload fields if needed
                        if (!pkgName) pkgName = payload.new?.pkg?.name ?? payload.new?.package_name ?? 'N/A'
                        if (!eventDateStr) eventDateStr = payload.new?.event_date ?? payload.new?.eventDate

                        const formattedDate = eventDateStr ? new Date(eventDateStr).toLocaleDateString() : 'N/A'
                        const body = `Status: ${String(payload.new?.status || '')} • Package: ${pkgName} • Date: ${formattedDate}`

                        await notifee.displayNotification({
                          title,
                          body,
                          android: {
                            channelId: channelIdRef.current ?? 'oshdy-default',
                            smallIcon: 'ic_launcher',
                            importance: AndroidImportance.HIGH,
                            vibrationPattern: [300, 150, 300, 150],
                            sound: 'default',
                            pressAction: { id: 'default', launchActivity: 'default' },
                          },
                          ios: { sound: 'default' },
                        });
                      } catch (err) {
                        console.warn('[Dashboard] notifee display error', err);
                      }
                    })();
                  }
                } catch (err) {
                  console.warn('[Dashboard] reservation payload handler error', err);
                }
            }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id]);



  const menu = [
      {
        id: 1,
        title: 'Beef Mushroom Stroganoff',
        background: IMAGES.beefMushroom,
      },
      {
        id: 2,
        title: 'Pork Caldereta',
        background: IMAGES.porkCaldereta,
      },
      {
        id: 3,
        title: 'Chicken Cordon Bleu',
        background: IMAGES.cordon,
      },
      {
        id: 4,
        title: 'Fish Fillet in Sweet & Sour Sauce',
        background: IMAGES.fishFillet,
      },
      {
        id: 5,
        title: 'Buttered Mixed Veggies',
        background: IMAGES.misvegie,
      },
      {
        id: 6,
        title: 'Creamy Carbonara',
        background: IMAGES.carbonara,
      },
    ];
  
  const design = [
      {
        id: 1,
        title: 'Decorative Wedding',
        background: IMAGES.wedding,
      },
      {
        id: 2,
        title: 'Debut Celebration',
        background: IMAGES.debut,
      },
      {
        id: 3,
        title: 'Kids Party Theme',
        background: IMAGES.kidsparty,
      },
    ];
  return (
    <SafeAreaView className="bg-background">
      <ScrollView>
        
        <View className='mb-3'>
            <DashboardHeader />
        </View>

        <View>
          <StatusSummary
            topStats={[
                    { label: 'Pending', count: pendingCount || 0 },
                    { label: 'Canceled', count: canceledCount || 0 },
                  ]}
            bottomStat={{ label: 'Total Reservations', count: totalCount || 0 }}
            />
        </View>

        <View className='mt-3 mb-3'>
            <UserEventShortcuts />
        </View>

        <View>
          <Banner 
          message="Welcome back! Don’t forget to check available dates." />
        </View>


        <View className='mt-3 mb-1'>
            <HorizontalCarousel
              title="Gourmet Selections"
              items={menu}
              imageKey="background"
              titleKey="title"
              seeAllRoute="/(app)/menus"
              loading={menuLoading}
              />
        </View>

        <View>
            <HorizontalCarousel
              title="Design Inspirations"
              items={design}
              imageKey="background"
              titleKey="title"
              seeAllRoute="/(app)/designs"
              loading={designLoading}
              />
        </View>

        <View className="px-4 py-6 items-center mt-2">
          <Text className="text-xs text-gray-400 italic mb-1">
            "Where every event is a feast of memories."
          </Text>
          <Text className="text-xs text-gray-300">© 2025 OSHDY Catering</Text>
        </View>
        
    </ScrollView>
      {/* Feedback prompt modal */}
      <AnimatedModal
        visible={showFeedbackPrompt}
        title="How was your event?"
        description={
          recentDoneReservation
            ? `Your reservation ${recentDoneReservation.receipt_number || ''} is marked as Done. We'd love to hear your feedback.`
            : 'One of your recent reservations is marked as Done. Would you like to leave feedback?'
        }
        animation={assistAnim}
        buttonText="Give Feedback"
        buttonColor="#10B981"
        onButtonPress={() => {
          setShowFeedbackPrompt(false);
          router.push('/(app)/feedback?category=Event%20Client');
        }}
        dismissable={true}
        onClose={() => setShowFeedbackPrompt(false)}
      />
    </SafeAreaView>
  )
}