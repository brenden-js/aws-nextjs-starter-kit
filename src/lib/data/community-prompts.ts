export interface Preset {
  id: string
  name: string
  prompt: string
}

export const communityPrompts: Preset[] = [
  {
    id: "9cb0e66a-9937-465d-a188-2c4c4ae2401f",
    name: "Draft email to client",
    prompt: "Draft a short email to my client Jane, about this new listing that just came on the market. \n" +
      "\n" +
      "Keep the email very brief and only mention a few key highlights of the house that make this house unique."
  },
  {
    id: "3454",
    name: "Create a TikTok video outline",
    prompt: "Create a video outline for TikTok that includes a script for sharing the highlights of this listing."
  },
  {
    id: "345",
    name: "Draft a blog post",
    prompt: "Create a long form blog post for this listing."
  },
  {
    id: "adfa95be-a575-45fd-a9ef-ea45386c64de",
    name: "Listing description",
    prompt: "Create a listing description for this house."
  },
]