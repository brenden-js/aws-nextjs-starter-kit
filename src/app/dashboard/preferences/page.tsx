'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Facebook, Twitter, Instagram, Linkedin, Youtube, X, Loader2 } from "lucide-react"

const contentTypes = [
  { id: 'listings', name: 'Listings', emoji: '🏠' },
  { id: 'marketReports', name: 'Market Reports', emoji: '📊' },
  { id: 'blogPosts', name: 'Blog Posts', emoji: '✍️' },
  { id: 'socialMedia', name: 'Social Media', emoji: '📱' },
  { id: 'emailNewsletters', name: 'Email Newsletters', emoji: '📧' },
  { id: 'propertyDescriptions', name: 'Property Descriptions', emoji: '🏘️' },
  { id: 'neighborhoodGuides', name: 'Neighborhood Guides', emoji: '🏙️' },
  { id: 'marketUpdates', name: 'Market Updates', emoji: '📈' },
  { id: 'clientTestimonials', name: 'Client Testimonials', emoji: '⭐' },
  { id: 'homeImprovementTips', name: 'Home Improvement Tips', emoji: '🔨' },
  { id: 'investmentAnalysis', name: 'Investment Analysis', emoji: '💹' },
  { id: 'videoScripts', name: 'Video Scripts', emoji: '🎥' },
]

const specialties = [
  { id: 'residential', name: 'Residential', emoji: '🏡' },
  { id: 'commercial', name: 'Commercial', emoji: '🏢' },
  { id: 'luxury', name: 'Luxury', emoji: '💎' },
  { id: 'investment', name: 'Investment', emoji: '💰' },
]

const marketingChannels = [
  { id: 'facebook', name: 'Facebook', icon: Facebook },
  { id: 'twitter', name: 'Twitter', icon: Twitter },
  { id: 'instagram', name: 'Instagram', icon: Instagram },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
  { id: 'youtube', name: 'YouTube', icon: Youtube },
]

const clientTypes = [
  { id: 'investors', name: 'Investors', emoji: '💼' },
  { id: 'firstTimeBuyers', name: 'First-Time Buyers', emoji: '🔑' },
  { id: 'luxuryBuyers', name: 'Luxury Buyers', emoji: '💎' },
  { id: 'retirees', name: 'Retirees', emoji: '🏖️' },
  { id: 'relocators', name: 'Relocators', emoji: '🚚' },
  { id: 'vacationHomeOwners', name: 'Vacation Home Owners', emoji: '🏝️' },
  { id: 'militaryFamilies', name: 'Military Families', emoji: '🎖️' },
  { id: 'internationalBuyers', name: 'International Buyers', emoji: '🌎' },
  { id: 'emptyNesters', name: 'Empty Nesters', emoji: '🐣' },
  { id: 'growingFamilies', name: 'Growing Families', emoji: '👨‍👩‍👧‍👦' },
]

export default function OnboardingSequence() {
  const [step, setStep] = useState(0)
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([])
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [selectedClientTypes, setSelectedClientTypes] = useState<string[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [zipCodes, setZipCodes] = useState<string[]>([])
  const [newZipCode, setNewZipCode] = useState('')

  const handleContentTypeSelection = (contentType: string) => {
    setSelectedContentTypes(prev =>
      prev.includes(contentType)
        ? prev.filter(ct => ct !== contentType)
        : [...prev, contentType]
    )
  }

  const handleSpecialtySelection = (specialty: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    )
  }

  const handleChannelSelection = (channelId: string) => {
    setSelectedChannels(prev =>
      prev.includes(channelId)
        ? prev.filter(ch => ch !== channelId)
        : [...prev, channelId]
    )
  }

  const handleClientTypeSelection = (clientType: string) => {
    setSelectedClientTypes(prev =>
      prev.includes(clientType)
        ? prev.filter(ct => ct !== clientType)
        : [...prev, clientType]
    )
  }

  const handleAddZipCode = () => {
    if (newZipCode && !zipCodes.includes(newZipCode)) {
      setZipCodes(prev => [...prev, newZipCode])
      setNewZipCode('')
    }
  }

  const handleRemoveZipCode = (zipCode: string) => {
    setZipCodes(prev => prev.filter(zc => zc !== zipCode))
  }

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  useEffect(() => {
    if (step === 7) {
      setIsChecking(true)
      const timer = setTimeout(() => {
        setIsChecking(false)
        nextStep()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [step])

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Card className="w-[450px] max-w-[90vw]">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to RealEstateAI! 🏠</CardTitle>
              <CardDescription>Let&apos;s personalize your content generation experience</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">We&apos;ll ask you a few questions to tailor your AI assistant and content generator to your specific needs as a real estate agent.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={nextStep}>Get Started</Button>
            </CardFooter>
          </Card>
        )
      case 1:
        return (
          <Card className="w-[450px] max-w-[90vw]">
            <CardHeader>
              <CardTitle className="text-2xl">What type of content do you need? 📝</CardTitle>
              <CardDescription>Select the types of content you want to generate</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contentTypes.map(contentType => (
                    <Button
                      key={contentType.id}
                      variant={selectedContentTypes.includes(contentType.id) ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleContentTypeSelection(contentType.id)}
                    >
                      <span className="mr-2">{contentType.emoji}</span>
                      {contentType.name}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
              <p className="text-sm text-muted-foreground mt-4">
                Select all the content types you&apos;d like the AI to help you create.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={prevStep} variant="outline" className="mr-2">Back</Button>
              <Button onClick={nextStep} disabled={selectedContentTypes.length === 0}>Next</Button>
            </CardFooter>
          </Card>
        )
      case 2:
        return (
          <Card className="w-[450px] max-w-[90vw]">
            <CardHeader>
              <CardTitle className="text-2xl">Ideal Client Types 👥</CardTitle>
              <CardDescription>Select the types of clients you want to work with</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {clientTypes.map(clientType => (
                    <Button
                      key={clientType.id}
                      variant={selectedClientTypes.includes(clientType.id) ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleClientTypeSelection(clientType.id)}
                    >
                      <span className="mr-2">{clientType.emoji}</span>
                      {clientType.name}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
              <p className="text-sm text-muted-foreground mt-4">
                We&apos;ll tailor your content to appeal to these client types.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={prevStep} variant="outline" className="mr-2">Back</Button>
              <Button onClick={nextStep} disabled={selectedClientTypes.length === 0}>Next</Button>
            </CardFooter>
          </Card>
        )
      case 3:
        return (
          <Card className="w-[450px] max-w-[90vw]">
            <CardHeader>
              <CardTitle className="text-2xl">Your Specialties 🏆</CardTitle>
              <CardDescription>Select the areas you specialize in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {specialties.map(specialty => (
                  <Button
                    key={specialty.id}
                    variant={selectedSpecialties.includes(specialty.id) ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleSpecialtySelection(specialty.id)}
                  >
                    <span className="mr-2">{specialty.emoji}</span>
                    {specialty.name}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                We&apos;ll use this information to generate content that aligns with your expertise.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={prevStep} variant="outline" className="mr-2">Back</Button>
              <Button onClick={nextStep} disabled={selectedSpecialties.length === 0}>Next</Button>
            </CardFooter>
          </Card>
        )
      case 4:
        return (
          <Card className="w-[450px] max-w-[90vw]">
            <CardHeader>
              <CardTitle className="text-2xl">Marketing Channels 📣</CardTitle>
              <CardDescription>Select the social networks where you&apos;ll share your content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {marketingChannels.map(channel => {
                  const Icon = channel.icon
                  return (
                    <Button
                      key={channel.id}
                      variant={selectedChannels.includes(channel.id) ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleChannelSelection(channel.id)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {channel.name}
                    </Button>
                  )
                })}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                We&apos;ll optimize your content for these specific marketing channels.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={prevStep} variant="outline" className="mr-2">Back</Button>
              <Button onClick={nextStep} disabled={selectedChannels.length === 0}>Next</Button>
            </CardFooter>
          </Card>
        )
      case 5:
        return (
          <Card className="w-[450px] max-w-[90vw]">
            <CardHeader>
              <CardTitle className="text-2xl">Target Zip Codes 📍</CardTitle>
              <CardDescription>Add zip codes you&apos;re focusing on</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter zip code"
                    value={newZipCode}
                    onChange={(e) => setNewZipCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddZipCode()}
                  />
                  <Button onClick={handleAddZipCode}>Add</Button>
                </div>
                <ScrollArea className="h-[200px]">
                  <AnimatePresence>
                    {zipCodes.map((zipCode) => (
                      <motion.div
                        key={zipCode}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between p-2 mb-2 bg-secondary rounded-md"
                      >
                        <span>{zipCode}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveZipCode(zipCode)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </ScrollArea>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                We&apos;ll use these zip codes to tailor your content to specific local markets.
              </p>
            </CardContent>
            <CardFooter>
              <Button  onClick={prevStep} variant="outline" className="mr-2">Back</Button>
              <Button onClick={nextStep} disabled={zipCodes.length === 0}>Next</Button>
            </CardFooter>
          </Card>
        )
      case 6:
        return (
          <Card className="w-[450px] max-w-[90vw]">
            <CardHeader>
              <CardTitle className="text-2xl">All Set! 🚀</CardTitle>
              <CardDescription>Your personalized AI assistant is ready</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">We&apos;ve tailored your RealEstateAI experience based on your preferences:</p>
              <ScrollArea className="h-[250px]">
                <div className="space-y-2">
                  <Badge variant="secondary" className="text-sm p-2 w-full justify-start">
                    <span className="mr-2">📝</span>
                    Content Types: {selectedContentTypes.map(ct => contentTypes.find(c => c.id === ct)?.name).join(', ')}
                  </Badge>
                  <Badge variant="secondary" className="text-sm p-2 w-full justify-start">
                    <span className="mr-2">👥</span>
                    Ideal Clients: {selectedClientTypes.map(ct =>
                      clientTypes.find(c => c.id === ct)?.name).join(', ')}
                  </Badge>
                  <Badge variant="secondary" className="text-sm p-2 w-full justify-start">
                    <span className="mr-2">🏆</span>
                    Specialties: {selectedSpecialties.map(s => specialties.find(sp => sp.id === s)?.name).join(', ')}
                  </Badge>
                  <Badge variant="secondary" className="text-sm p-2 w-full justify-start">
                    <span className="mr-2">📣</span>
                    Marketing Channels: {selectedChannels.map(ch => marketingChannels.find(c => c.id === ch)?.name).join(', ')}
                  </Badge>
                  <Badge variant="secondary" className="text-sm p-2 w-full justify-start">
                    <span className="mr-2">📍</span>
                    Zip Codes: {zipCodes.join(', ')}
                  </Badge>
                </div>
              </ScrollArea>
              <p className="text-sm mt-4">We&apos;ll use these preferences to generate tailored content for your real estate business!</p>
            </CardContent>
            <CardFooter>
              <Button onClick={nextStep}>Start Generating Content</Button>
            </CardFooter>
          </Card>
        )
      case 7:
        return (
          <Card className="w-[450px] max-w-[90vw]">
            <CardHeader>
              <CardTitle className="text-2xl">Preparing Your AI Assistant 🤖</CardTitle>
              <CardDescription>We&apos;re setting up your personalized content generator</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">This may take a few moments...</p>
            </CardContent>
          </Card>
        )
      case 8:
        return (
          <Card className="w-[450px] max-w-[90vw]">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Go! 🎉</CardTitle>
              <CardDescription>Your AI assistant is now ready to help you create amazing content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Your RealEstateAI assistant is now set up and ready to help you generate content tailored to your needs. You can start by asking it to create your first piece of content or explore the different features available.
              </p>
              <p className="text-sm font-semibold">
                Tip: Try asking &quot;Generate a listing description for a 3-bedroom house in a suburban area&quot;
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() =>
                console.log("Onboarding complete!", {
                  selectedContentTypes,
                  selectedClientTypes,
                  selectedSpecialties,
                  selectedChannels,
                  zipCodes
                })
              }>
                Start Using RealEstateAI
              </Button>
            </CardFooter>
          </Card>
        )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}