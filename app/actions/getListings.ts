import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount: number;
  bathroomCount: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
} 

export default async function getListings(
  params: IListingsParams
) {
    // const currentUser = await getCurrentUser();
    try {
      const {userId,
      roomCount,
      guestCount,
      bathroomCount,
      locationValue,
      startDate,
      endDate,
      category
      } = params;

      let query: any = {}

      if (userId) {
        query.userId = Number(userId);
      }

      if (category) {
        query.category = category;
      }

      if (roomCount) {
        query.roomCount = {
          gte: +roomCount
        }
      }

      if (guestCount) {
        query.guestCount = {
          gte: +guestCount
        }
      }

      if (bathroomCount) {
        query.bathroomCount = {
          gte: +bathroomCount
        }
      }

      if (locationValue) {
        query.locationValue = locationValue;
      }

      if (startDate && endDate) {
        query.NOT = {
          reservations: {
            some: {
              OR:[
                {
                  endDate: { gte: startDate},
                  startDate: { lte: startDate}
                },
                {
                  startDate: { gte: endDate},
                  endDate: { lte: endDate}
                },
              ]
            }
          }
        }
      }


    const listings = await prisma.listing.findMany({
      where: query,
      // where: {
      //   user:{
      //     NOT: {
      //       id: currentUser?.id
      //     }
      //   }
      // },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }))

    return safeListings;
  } catch (error: any) {
    throw new Error(error);
  }
}