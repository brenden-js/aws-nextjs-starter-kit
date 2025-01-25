// import {Resource} from 'sst';
// import {IoTDataPlaneClient, PublishCommand} from "@aws-sdk/client-iot-data-plane";
// import {Listing} from "@/trpc/routers/helpers/types";
//
// const endpoint = Resource.RealtimeLink.endpoint;
// const authorizer = Resource.RealtimeLink.authorizer;
// const topic = `${Resource.App.name}/${Resource.App.stage}`;
//
//
// const data = new IoTDataPlaneClient();
//
// export interface LiveDataFeedUpdate {
//     houseId: string;
//     dataCategory: "Property" | "Location" | "Financial";
//     updateType: 'LiveDataFeedUpdate';
//     jobStatus: 'complete' | 'in-progress';
// }
//
// export interface ListingScanUpdate {
//     houseId: string;
//     updateType: 'ListingScanUpdate';
//     stAddress: string;
// }
//
// export async function publishStatusFromServer(message: LiveDataFeedUpdate | ListingScanUpdate, userId: string): Promise<void> {
//     console.log("Attempting to publish...")
//
//     try {
//         const res = await data.send(
//             new PublishCommand({
//                 payload: Buffer.from(
//                     JSON.stringify(message)
//                 ),
//                 topic: `${userId}-house-updates`,
//             })
//         );
//         console.log('Sent message to client successfully.', res)
//     } catch (e) {
//         console.log('Error sending update to client.', e)
//     }
// }