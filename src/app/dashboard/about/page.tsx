'use client'

import React, {useState} from 'react'
import {Textarea} from "@/components/ui/textarea"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Separator} from "@/components/ui/separator";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default function Component() {
  const [bio, setBio] = useState('')
  const [newPreference, setNewPreference] = useState('')
  const [preferences, setPreferences] = useState([
    "I prefer modern architecture",
    "I value energy efficiency in homes",
    "Looking for a pet-friendly property"
  ]);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value
    if (input.length <= 280) {
      setBio(input)
    }
  }

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPreference(e.target.value)
  }

  const addPreference = () => {
    if (newPreference.trim() !== '') {
      setPreferences([...preferences, newPreference.trim()]);
      setNewPreference('');
    }
  }

  const deletePreference = (index: number) => {
    setPreferences(preferences.filter((_, i) => i !== index));
  }

  const remainingChars = 280 - bio.length

  return (
    <div className={"h-full flex flex-col"}>
      <div className={"ml-3 flex items-center flex-row h-16"}>
        About and Preferences
      </div>
      <Separator/>
      <div className="p-3 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4">

        {/* Bio Card */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Bio</CardTitle>
            <CardDescription>Tell us about yourself, we will add it into your chats.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Textarea
                id="bio"
                placeholder="I'm a passionate real estate professional..."
                value={bio}
                onChange={handleBioChange}
                className="h-32 resize-none"
              />
              <p className="text-sm text-muted-foreground text-right">
                {remainingChars} characters remaining
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Card */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Preferences</CardTitle>
            <CardDescription>These are your preferences for the chat bot output.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <ul className="list-disc list-inside space-y-1">
                {preferences.map((preference, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{preference}</span>
                    <Button variant="ghost" size="icon" onClick={() => deletePreference(index)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Input
                  id="preferences"
                  placeholder="Add preference"
                  value={newPreference}
                  onChange={handlePreferenceChange}
                />
                <Button onClick={addPreference}>Add</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}