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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skill } from "@/app/dashboard/page"

interface AddSkillPopupProps {
    skills: Skill[]
    onAddSkill?: () => void
}

export default function AddSkillPopup({ skills = [], onAddSkill }: AddSkillPopupProps) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [timeCount, setTimeCount] = useState("")
    const [parentSkill, setParentSkill] = useState("")
    const [nameError, setNameError] = useState("")
    const [timeCountError, setTimeCountError] = useState("")
    const [loading, setLoading] = useState(false)


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setNameError("Name is required");
            return
        }
        if (timeCount.trim() && isNaN(Number(timeCount))) {
            setTimeCountError("Time must be a number");
            return;
        }
        if (Number(timeCount) > 2, 147, 483, 647) {
            setTimeCountError("The number you have provided is too big")
            return;
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
                    timeCount: timeCount.trim() || 0,
                    parentId: skills.find(skill => skill.name === parentSkill)?.id ?? null
                }),
            });

            const result = await response.json();
            console.log("Skill successfully added:", result);

            // Reset and close
            setName("");
            setTimeCount("");
            setParentSkill("");
            setOpen(false);
        } catch (err) {
            console.error("Error posting skill:", err);
        } finally {
            setLoading(false);
        }

        onAddSkill?.()
    };

    const handleCancel = () => {
        // Reset form and close dialog
        setName("")
        setTimeCount("")
        setNameError("")
        setParentSkill("")
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
            <DialogContent className="sm:max-w-[425px]">
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
                            <Label htmlFor="timeSpent">Time Spent (optional)</Label>
                            <Input
                                id="timeSpent"
                                value={timeCount}
                                onChange={(e) => {
                                    setTimeCount(e.target.value)
                                    if (timeCountError) setTimeCountError("")
                                }}
                                placeholder="e.g., 2 years, 6 months, 100 hours"
                            />
                            {timeCountError && <p className="text-sm text-destructive">{timeCountError}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="parentSkill">Parent Skill (optional)</Label>
                            <Select value={parentSkill} onValueChange={setParentSkill}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a parent skill" />
                                </SelectTrigger>
                                <SelectContent>
                                    {skills.map((skill) => !skill.parentId ? (
                                        <SelectItem key={skill.id} value={skill.name}>
                                            {skill.name}
                                        </SelectItem>
                                    ) : null)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit">Add Skill</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

