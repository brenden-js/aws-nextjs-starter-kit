import MultiHouseDetailsPage from './multi-house-details-page'

export default function Page({ params }: { params: { houseIds?: string[] } }) {
  // If no houseIds are provided, pass an empty array
  const houseIds = params.houseIds || []
  return <MultiHouseDetailsPage houseIds={houseIds} />
}