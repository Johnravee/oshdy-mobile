import { View, ScrollView, Text } from 'react-native'
import React, {useEffect} from 'react'
import StatusSummary from '@/components/ui/statusSummary'
import { IMAGES } from '@/constants/Images'
import UserEventShortcuts from '@/components/ui/UserEventShortcuts'
import Banner from '@/components/ui/banner'
import HorizontalCarousel from '@/components/ui/HorizontalCarousel'
import DashboardHeader from '@/components/ui/dashboardHeader'
import { useTotalBookCountByUser } from '@/hooks/useTotalBookCountByUser'
import { usePendingReservationCount } from '@/hooks/usePendingReservationCount'
import { useCanceledReservationCount } from '@/hooks/useCanceledReservationCount'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useProfileContext } from '@/context/ProfileContext'
import { useRouter } from 'expo-router'

export default function Dashboard() {
  const router = useRouter();
  const { profile } = useProfileContext();
  const { totalCount } = useTotalBookCountByUser();
  const { pendingCount } = usePendingReservationCount();
  const { canceledCount } = useCanceledReservationCount();

  useEffect(() => {
  if (!profile) {
    router.replace("/(app)/onboarding");
  }
}, [profile]);


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
            />
        </View>

        <View>
          <HorizontalCarousel
            title="Design Inspirations"
            items={design}
            imageKey="background"
            titleKey="title"
            seeAllRoute="/(app)/designs"
            />
        </View>

        <View className="px-4 py-6 items-center mt-2">
          <Text className="text-xs text-gray-400 italic mb-1">
            "Where every event is a feast of memories."
          </Text>
          <Text className="text-xs text-gray-300">© 2025 OSHDY Catering</Text>
        </View>
        
    </ScrollView>
    </SafeAreaView>
  )
}