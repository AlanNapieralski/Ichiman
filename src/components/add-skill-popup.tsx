"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { TimePicker } from "@/components/ui/TimePicker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Skill } from "@/models/skill"

interface AddSkillPopupProps {
    skills: Skill[]
    onAddSkill?: (newSkillId?: number) => void
}

export default function AddSkillPopup({ skills = [], onAddSkill }: AddSkillPopupProps) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [totalSeconds, setTotalSeconds] = useState(0)
    const [parentSkill, setParentSkill] = useState("")
    const [description, setDescription] = useState("")
    const [nameError, setNameError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setNameError("Name is required");
            return
        }


        if (skills.some(skill => skill.name === name)) {
            setNameError("Skill of that name already exists")
            return
        }

        setNameError("");
        setLoading(true);

        try {
            // Call POST API
            const response = await fetch("/api/main-skills", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    userId: 1,
                    timeCount: totalSeconds,
                    parentId: skills.find(skill => skill.name === parentSkill)?.id ?? null,
                    description: description.trim() || undefined
                }),
            });

            const result: Skill = await response.json();
            console.log("Skill successfully added:", result);

            // Reset and close
            setName("");
            setTotalSeconds(0);
            setParentSkill("");
            setDescription("")
            setOpen(false);

            // Call the callback with the new skill ID
            onAddSkill?.(result?.id ?? undefined)
        } catch (err) {
            console.error("Error posting skill:", err)
            // Call the callback without ID on error
            onAddSkill?.()
        } finally {
            setLoading(false)
        }
    };

    const handleCancel = () => {
        // Reset form and close dialog
        setName("")
        setTotalSeconds(0)
        setNameError("")
        setParentSkill("")
        setDescription("")
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Skill
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Skill</DialogTitle>
                    <DialogDescription>Add a new skill to your profile. Fill in the details below.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value)
                                    if (nameError) setNameError("")
                                }}
                                placeholder="e.g., JavaScript, React, Python"
                                className={nameError ? "border-destructive" : ""}
                            />
                            {nameError && <p className="text-sm text-destructive">{nameError}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="timeSpent">Initial Time Spent (optional)</Label>
                            <TimePicker
                                totalSeconds={totalSeconds}
                                setTotalSeconds={setTotalSeconds}
                            />
                            <p className="text-xs text-gray-500">
                                Set the initial time you&aposve already spent on this skill
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="parentSkill">Parent Skill (optional)</Label>
                            <Select value={parentSkill} onValueChange={setParentSkill}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a parent skill" />
                                </SelectTrigger>
                                <SelectContent>
                                    {skills.map((skill) => skill && !skill.parentId ? (
                                        <SelectItem key={skill.id || 0} value={skill.name}>
                                            {skill.name}
                                        </SelectItem>
                                    ) : null)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (optional)</Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Short notes or purpose"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Skill"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

