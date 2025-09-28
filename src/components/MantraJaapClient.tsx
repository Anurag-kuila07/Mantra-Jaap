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
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  RotateCw,
  Save,
  Settings,
  Pencil,
  BookOpen,
  Trash2,
  Minus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function MantraJaapClient() {
  const [mantra, setMantra] = useLocalStorage("mantra", "Om Namah Shivaya");
  const [newMantra, setNewMantra] = useState(mantra);
  const [count, setCount] = useState(0);
  const [malaReps, setMalaReps] = useLocalStorage("malaReps", 108);
  const [newMalaReps, setNewMalaReps] = useState<number | string>(malaReps);
  const [theme, setTheme] = useLocalStorage("theme", "dark");
  const [isShaking, setIsShaking] = useState(false);

  const [sessions, setSessions] = useLocalStorage<Session[]>("sessions", []);
  const [isClient, setIsClient] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      if (newCount > 0 && newCount % malaReps === 0) {
        navigator.vibrate(1000);
      } else {
        navigator.vibrate(100);
      }
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleDecrement = () => {
    setCount((prev) => {
      const newCount = prev > 0 ? prev - 1 : 0;
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        if (newCount > 0 && newCount % malaReps === 0) {
          navigator.vibrate(1000);
        }
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

  const malasCompleted = isClient ? (count / malaReps).toFixed(2) : '0.00';

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
            className="text-6xl sm:text-8xl font-bold text-primary-foreground"
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
          <div className="w-full max-w-sm flex gap-4">
            <Button
              size="lg"
              className="h-16 text-xl w-full"
              style={{ backgroundColor: theme === 'dark' ? '#4f46e5' : '#c7d2fe' }}
              onClick={handleDecrement}
            >
              <Minus className="w-8 h-8" />
            </Button>
            <Button
              size="lg"
              className={cn("h-16 text-xl w-full", isShaking && "shake")}
              style={{ backgroundColor: theme === 'dark' ? '#16a34a' : '#bbf7d0' }}
              onClick={handleIncrement}
            >
              <Plus className="w-8 h-8" />
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
                    onChange={(e) => setNewMalaReps(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme-switch">Dark Theme</Label>
                   <Switch
                    id="theme-switch"
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => {
                      setTheme(checked ? 'dark' : 'light');
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button onClick={() => {
                    if (typeof newMalaReps === 'number') {
                      setMalaReps(newMalaReps)
                    }
                  }}>Save</Button>
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
              {/* For Desktop */}
              <div className="hidden md:block">
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
              </div>

              {/* For Mobile */}
              <div className="grid gap-4 md:hidden">
                {sessions.length > 0 ? (
                  sessions.map((session) => (
                    <Card key={session.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold truncate max-w-[200px]">{session.mantra}</p>
                          <p className="text-sm text-muted-foreground">{session.date}</p>
                        </div>
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
                      </div>
                      <div className="flex justify-between mt-4 text-sm">
                        <div className="text-center">
                          <p className="font-bold">{session.count}</p>
                          <p className="text-muted-foreground">Count</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold">{session.malas}</p>
                          <p className="text-muted-foreground">Malas</p>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">
                    No saved sessions yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
