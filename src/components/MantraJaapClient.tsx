"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { countMantras } from "@/ai/flows/voice-activated-counting";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Session } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mic,
  Plus,
  RotateCw,
  Save,
  Settings,
  Pencil,
  Loader2,
  BookOpen,
  Hourglass,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

export default function MantraJaapClient() {
  const [mantra, setMantra] = useLocalStorage("mantra", "Om Namah Shivaya");
  const [newMantra, setNewMantra] = useState(mantra);
  const [count, setCount] = useState(0);
  const [malaReps, setMalaReps] = useLocalStorage("malaReps", 108);
  const [newMalaReps, setNewMalaReps] = useState(malaReps);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const [sessions, setSessions] = useLocalStorage<Session[]>("sessions", []);

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [isAnimating, setIsAnimating] = useState(false);

  const { toast } = useToast();

  const startTimer = useCallback(() => {
    if (!isTimerActive) setIsTimerActive(true);
  }, [isTimerActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive]);

  const handleIncrement = () => {
    startTimer();
    setCount((prev) => prev + 1);
    setIsAnimating(true);
  };

  useEffect(() => {
    if (isAnimating) {
      const timeout = setTimeout(() => setIsAnimating(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [isAnimating]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const startRecording = async () => {
    startTimer();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        setIsProcessing(true);
        toast({
          title: "Processing Audio",
          description: "AI is counting your chants...",
        });
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const audioDataUri = reader.result as string;
          try {
            const result = await countMantras({
              audioDataUri,
              mantra,
              sampleRate: 44100, // Common sample rate
            });
            setCount((prev) => prev + result.count);
            toast({
              title: "Success",
              description: `Added ${result.count} chants.`,
            });
          } catch (error) {
            console.error("AI counting error:", error);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Could not count chants from audio.",
            });
          } finally {
            setIsProcessing(false);
            audioChunksRef.current = [];
          }
        };
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Could not start recording:", error);
      toast({
        variant: "destructive",
        title: "Recording Error",
        description: "Could not access microphone.",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleReset = () => {
    setCount(0);
    setElapsedTime(0);
    setIsTimerActive(false);
  };

  const handleSaveSession = () => {
    if (count > 0) {
      const newSession: Session = {
        id: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        mantra,
        count,
        malas: parseFloat((count / malaReps).toFixed(2)),
        duration: formatTime(elapsedTime),
      };
      setSessions([newSession, ...sessions]);
      handleReset();
      toast({ title: "Session Saved", description: "Your progress has been recorded." });
    }
  };

  const malasCompleted = (count / malaReps).toFixed(2);

  return (
    <div className="w-full max-w-2xl mx-auto font-headline">
      <Card className="text-center shadow-xl">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Mantra Jaap</CardTitle>
          <div className="flex items-center justify-center gap-2 mt-2 text-muted-foreground">
            <p className="text-lg">{mantra}</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Pencil className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Your Mantra</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Label htmlFor="mantra-input">Mantra</Label>
                  <Input
                    id="mantra-input"
                    value={newMantra}
                    onChange={(e) => setNewMantra(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      onClick={() => {
                        setMantra(newMantra);
                        toast({ title: "Mantra Updated!"});
                      }}
                    >
                      Save
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-6">
          <div
            className={`text-8xl font-bold text-primary-foreground ${
              isAnimating ? "animate-count-update" : ""
            }`}
            style={{ color: 'hsl(var(--primary-foreground))' }}
          >
            {count}
          </div>
          <div className="flex justify-around w-full text-lg text-muted-foreground">
            <div className="flex flex-col items-center">
              <span className="font-bold">{malasCompleted}</span>
              <span>Malas</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold">{formatTime(elapsedTime)}</span>
              <span>Time</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <Button
              size="lg"
              className="h-16 text-xl"
              onClick={handleIncrement}
            >
              <Plus className="w-8 h-8 mr-2" />
              Add
            </Button>
            <Button
              size="lg"
              className="h-16 text-xl"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              variant={isRecording ? "destructive" : "default"}
            >
              {isProcessing ? (
                <Loader2 className="w-8 h-8 mr-2 animate-spin" />
              ) : isRecording ? (
                <Mic className="w-8 h-8 mr-2" />
              ) : (
                <Mic className="w-8 h-8 mr-2" />
              )}
              {isRecording ? "Stop" : "Voice"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" onClick={handleReset}>
            <RotateCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSaveSession}>
            <Save className="w-4 h-4 mr-2" />
            Save Session
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
                <DialogDescription>Personalize your experience.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mala-reps">Repetitions per Mala</Label>
                  <Input
                    id="mala-reps"
                    type="number"
                    className="w-24"
                    value={newMalaReps}
                    onChange={(e) => setNewMalaReps(Number(e.target.value))}
                  />
                </div>
                 <div className="flex items-center justify-between">
                  <Label htmlFor="sound-feedback">Sound on Count</Label>
                  <Switch id="sound-feedback" disabled />
                </div>
              </div>
              <DialogFooter>
                 <DialogClose asChild>
                    <Button onClick={() => setMalaReps(newMalaReps)}>Save</Button>
                 </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      <Tabs defaultValue="history" className="w-full mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">
            <Hourglass className="w-4 h-4 mr-2" />
            Current
          </TabsTrigger>
          <TabsTrigger value="history">
            <BookOpen className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="current">
            <Card>
                <CardHeader>
                    <CardTitle>Current Session</CardTitle>
                    <CardDescription>Your progress in this session.</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-4xl font-bold">{count}</p>
                    <p className="text-muted-foreground">{mantra}</p>
                    <div className="flex justify-around text-lg">
                        <p>Malas: {malasCompleted}</p>
                        <p>Time: {formatTime(elapsedTime)}</p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
                <CardTitle>Session History</CardTitle>
                <CardDescription>Review your past chanting sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Mantra</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                    <TableHead className="text-right">Malas</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.length > 0 ? (
                    sessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>{session.date}</TableCell>
                        <TableCell className="truncate max-w-[150px]">{session.mantra}</TableCell>
                        <TableCell className="text-right">{session.count}</TableCell>
                        <TableCell className="text-right">{session.malas}</TableCell>
                        <TableCell className="text-right">{session.duration}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No saved sessions yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
