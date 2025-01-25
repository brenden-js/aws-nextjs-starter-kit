"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {Card, CardContent, CardHeader} from "../../../components/ui/card";
import {Button} from "../../../components/ui/button";
import {api} from "../../../trpc/react";
import {useContext, useState} from "react";
import {Input} from "../../../components/ui/input";
import {PlusIcon, ReloadIcon} from "@radix-ui/react-icons";
import {CurrentPromptContext, UnhydratedHouse} from "../contexts/prompts";
import {toast} from "sonner";
import Link from "next/link";

export const AddHouse = () => {
  const {selectedHouses, addHouse} = useContext(CurrentPromptContext)
  const utils = api.useUtils()
  const houseMutation = api.house.searchHouse.useMutation({
    onSuccess: (data) => {
      addHouse(data)
      setRawAddress("")
      setNewHousePreview(data)
      toast.success('Found house, getting additional data!')
    },
    onError: ({message}) => {
      console.log('Error', message)
      toast.error('Unable to find this house, try again later.')
    }
  })
  const [rawAddress, setRawAddress] = useState("")
  const getHouseData = async () => {
    await houseMutation.mutateAsync({stAddress: rawAddress});
  };

  const [newHousePreview, setNewHousePreview] = useState<UnhydratedHouse>()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) setNewHousePreview(undefined)
    }}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
        >
          <PlusIcon className="mx-auto text-gray-400"/>
          <span className="block text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors">Add house</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Search for new house</DialogTitle>
          <DialogDescription>Enter the full address, and we will find the closest match</DialogDescription>
        </DialogHeader>
        <div className="flex justify-between w-full mx-auto mb-4">
          <Input
            value={rawAddress}
            onChange={(e) => setRawAddress(e.target.value)}
            disabled={houseMutation.isPending || selectedHouses.length >= 1}
            className="w-[70%] rounded-md px-4 py-2 shadow-sm focus:border-black"
            placeholder={"12345 Main Street, Los Angeles CA 90210"}
          />
          <Button
            onClick={() => {
              void getHouseData()
            }}
            className={"w-[150px]"}
            disabled={houseMutation.isPending || selectedHouses.length >= 1 || rawAddress.length < 6}
          >
            {houseMutation.isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>}
            Get listing
          </Button>
        </div>
        {houseMutation.error && (
          <p className="mx-auto mb-4 text-red-600">
            {houseMutation.error.message}
          </p>
        )}
        {newHousePreview && !!selectedHouses.length && (
          <div id="new-house-preview" className="mb-4 mt-2 items-center mx-auto flex-col w-full rounded-md pr-4">
            <Card className={"min-w-[400px]"}>
              <CardHeader>
                <CardContent className="pt-5 flex items-center justify-between">
                  {newHousePreview.stAddress}, {newHousePreview.city} {newHousePreview.zipCode} found!
                  <Link href={`/dashboard/${newHousePreview.id}`} passHref>
                    <Button variant={'default'}>Go to house</Button>
                  </Link>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}