"use client";

import { useState, useEffect } from "react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  Plus,
  RotateCw,
  Save,
  Settings,
  Pencil,
  BookOpen,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

export default function MantraJaapClient() {
  const [mantra, setMantra] = useLocalStorage("mantra", "Om Namah Shivaya");
  const [newMantra, setNewMantra] = useState(mantra);
  const [count, setCount] = useState(0);
  const [malaReps, setMalaReps] = useLocalStorage("malaReps", 108);
  const [newMalaReps, setNewMalaReps] = useState(malaReps);
  const [soundOnMala, setSoundOnMala] = useLocalStorage("soundOnMala", true);

  const [sessions, setSessions] = useLocalStorage<Session[]>("sessions", []);
  const [isClient, setIsClient] = useState(false);
  const [malaAudio, setMalaAudio] = useState<HTMLAudioElement | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    // Bell sound for mala completion
    setMalaAudio(new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YUReT19x4AEB+PyP/u//lP/h/1j/wf9t/0b/g/+D/3f/Z/+D/3v/Vv+D/1X/a/+p/yT/1/8s/8L/af+c/6D/uf+w/6v/df9//7P/yP/J//n/wv/1/8//7f/P/93/3v/h/+L/4v/b/9r/2P/c/9//3f/e/9v/3//i/+f/5v/j/9n/3P/g/+T/6v/r/+r/6f/p/+r/6//s/+3/7f/s/+3/7v/v/+7/7v/t/+7/8P/x//D/8P/y//H/8P/x//H/8v/y//H/8f/x//L/8//z//P/8//z//T/9P/1//T/9f/1//T/9v/2//b/9v/2//f/9//3//f/9//4//j/+P/4//n/+f/5//n/+f/6//r/+v/6//r/+v/6//r/+v/7//v/+7/7//v/+7/7//v/+7/7v/v/+7/7//w//D/8P/w//D/8P/w//H/8f/x//H/8f/y//L/8v/y//L/8v/y//L/8v/z//P/8//z//P/8//z//P/9P/0//T/9P/0//T/9P/0//X/9f/1//X/9f/1//X/9f/2//b/9v/2//b/9v/2//b/9v/3//f/9//3//f/9//3//f/9//4//j/+P/4//j/+P/4//j/+P/5//n/+f/5//n/+f/5//n/+f/6//r/+v/6//r/+v/6//r/+v/6/vr/+v/6//r/+v/7//v/+7/7//u/+7/7v/u/+7/7v/u/w=="));
  }, []);

  const handleIncrement = () => {
    setCount((prev) => {
      const newCount = prev + 1;
      if (soundOnMala && newCount > 0 && newCount % malaReps === 0 && malaAudio) {
        malaAudio.currentTime = 0;
        malaAudio.play().catch(e => console.error("Error playing sound:", e));
      }
      return newCount;
    });
  };

  const handleReset = () => {
    setCount(0);
  };

  const handleSaveSession = () => {
    if (count > 0) {
      const newSession: Session = {
        id: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        mantra,
        count,
        malas: parseFloat((count / malaReps).toFixed(2)),
      };
      setSessions([newSession, ...sessions]);
      handleReset();
      toast({
        title: "Session Saved",
        description: "Your progress has been recorded.",
      });
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter((session) => session.id !== sessionId));
    toast({
      title: "Session Deleted",
      description: "The session has been removed from your history.",
      variant: "destructive"
    });
  };

  const malasCompleted = (count / malaReps).toFixed(2);

  if (!isClient) {
    return (
      <div className="w-full max-w-2xl mx-auto font-headline">
        <Card className="text-center shadow-xl animate-pulse">
          <CardHeader>
            <div className="h-10 bg-muted rounded-md w-1/2 mx-auto"></div>
            <div className="h-6 bg-muted rounded-md w-1/3 mx-auto mt-2"></div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-6">
            <div className="h-24 w-40 bg-muted rounded-lg"></div>
            <div className="flex justify-around w-full">
              <div className="h-12 bg-muted rounded-md w-1/4"></div>
            </div>
            <div className="h-16 bg-muted rounded-md w-1/2"></div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <div className="h-10 bg-muted rounded-md w-24"></div>
            <div className="h-10 bg-muted rounded-md w-32"></div>
            <div className="h-10 bg-muted rounded-md w-10"></div>
          </CardFooter>
        </Card>
      </div>
    );
  }

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
                        toast({ title: "Mantra Updated!" });
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
            className="text-8xl font-bold text-primary-foreground"
            style={{ color: "hsl(var(--primary-foreground))" }}
          >
            {count}
          </div>
          <div className="flex justify-around w-full text-lg text-muted-foreground">
            <div className="flex flex-col items-center">
              <span className="font-bold">{malasCompleted}</span>
              <span>Malas</span>
            </div>
          </div>
          <div className="w-full max-w-sm">
            <Button
              size="lg"
              className="h-16 text-xl w-full"
              onClick={handleIncrement}
            >
              <Plus className="w-8 h-8 mr-2" />
              Add
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
                <DialogDescription>
                  Personalize your experience.
                </DialogDescription>
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
                  <Label htmlFor="sound-feedback">Sound on Mala Completion</Label>
                  <Switch 
                    id="sound-feedback"
                    checked={soundOnMala}
                    onCheckedChange={setSoundOnMala}
                  />
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
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="history">
            <BookOpen className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Session History</CardTitle>
              <CardDescription>
                Review your past chanting sessions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Mantra</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                    <TableHead className="text-right">Malas</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.length > 0 ? (
                    sessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>{session.date}</TableCell>
                        <TableCell className="truncate max-w-[150px]">
                          {session.mantra}
                        </TableCell>
                        <TableCell className="text-right">
                          {session.count}
                        </TableCell>
                        <TableCell className="text-right">
                          {session.malas}
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete your session from the
                                  history.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteSession(session.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
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
