"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// import { UserAvatar } from "@/components/UserAvatar";
import { Card, CardContent } from "@/components/ui/card";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { toast } from "@/lib/hooks/use-toast";
// import { formatTime, pusherClient } from "@/lib/pusher";
// import {
//   ChatRoomWithMessagesAndCommunity,
//   UsersWithCommunityMessages,
// } from "@/lib/types";
import { UploadButton } from "@/lib/uploadthing";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ImageDownIcon, ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { ChatRoomWithMessages, ChatRoomWithMessagesAndParticipants, UserWithMessages } from "@/lib/types";
import { deleteMessage, fetchMessages, fetchUsers, inspectChatRoom, sendMessage } from "../../../../../actions/chat";
import { toast } from "@/components/ui/use-toast";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
// import {
//   deleteMessage,
//   fetchMessages,
//   fetchUsersWhoChatted,
//   inspectChatRoomEmployee,
//   sendMessage,
// } from "../../../../../actions/chat";
// import ImageUpload from "@/app/components/image-upload";

interface Props {
  chatroom: ChatRoomWithMessages;
  userId: string;
}

export const ChatRoom = ({ chatroom, userId }: Props) => {
  const [content, setContent] = useState<string>("");
  const queryClient = useQueryClient();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [userSearch, setUserSearch] = useState("");
  const router = useRouter()
  const pathname = usePathname()

  const currentChatroomId = pathname.replace("/message/", "")

  const { data: users, isError, isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await fetchUsers(userSearch) as ChatRoomWithMessagesAndParticipants[],
    refetchInterval: 2 * 1000,
    staleTime: 2 * 1000,
  });

  const {
    data: messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(
    ["messages", chatroom.id],
    ({ pageParam = 0 }) => fetchMessages(chatroom.id, pageParam, 20), // 20 messages limit then take na if umangat si user
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchInterval: 4 * 1000,
      staleTime: 4 * 1000,
    }
  );

  const otherParticipant = chatroom?.participants.find(p => p.id !== userId)

  // useEffect(() => {
  //   pusherClient.subscribe(chatroom.id);
  //   endOfMessagesRef.current?.scrollIntoView();

  //   const messageHandler = (newMessage: any) => {
  //     // Parse the createdAt string into a Date object
  //     const createdAtDate = new Date(newMessage.createdAt);

  //     // Use queryClient to optimistically update the messages query data
  //     queryClient.setQueryData(["messages", chatroom.id], (oldData: any) => {
  //       // Prepend the new message to the start of the messages array
  //       const newPages = oldData.pages.map((page: any, pageIndex: any) => {
  //         if (pageIndex === 0) {
  //           // Assuming the first page contains the newest messages
  //           return {
  //             messages: [
  //               { ...newMessage, createdAt: createdAtDate },
  //               ...page.messages,
  //             ],
  //           };
  //         }
  //         return page;
  //       });

  //       return { ...oldData, pages: newPages };
  //     });

  //     // Optionally, scroll to the new message
  //     endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  //   };

  //   pusherClient.bind("messages:new", messageHandler);

  //   return () => {
  //     pusherClient.unsubscribe(chatroom.id);
  //     pusherClient.unbind("messages:new", messageHandler);
  //   };
  // }, [chatroom.id, queryClient, messages]);

  const handleScroll = (event: any) => {
    const { scrollTop } = event.currentTarget;

    if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isError) {
    return <div>Error fetching communities</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // const avatarFallback = chatroom.community.name.charAt(0);

  return (
    <>
      <div className="md:hidden w-fit p-1 mt-[54px] md:mt-0 cursor-pointer">
        <Link
          href="/message"
        >
          Go Back
        </Link>
      </div>

      <div className="flex h-screen bg-white dark:bg-zinc-800 border border-lime-500 rounded-lg mt-[32px] md:mt-0">
        <aside className="w-80 border-r dark:border-zinc-700 max-md:hidden">
          <div className="p-4 space-y-4 h-screen overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Messages</h2>
            </div>

            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="text" placeholder="Search users" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
              <Button
                type="submit"
                disabled={isPending}
                onClick={() => {
                  startTransition(() => {
                    fetchUsers(userSearch).then((callback) => {
                      refetch()
                    })
                  })
                }}
              >
                Search
              </Button>
            </div>

            {users?.map((user, i) => {

              const otherParticipant = user.participants?.find(participant => participant.id !== userId)

              return (
                // <div className="space-y-2" key={user.id}>
                <Card className="p-2 cursor-pointer border-lime-500" key={i} onClick={() => {
                  {
                    userSearch ?
                      inspectChatRoom(user?.id as string)
                      :
                      inspectChatRoom(otherParticipant?.id as string)
                  }
                }}>
                  {/* AVATAR OF COMMUNITY HINGIN NLNG IMAGE LOGO NG MGA COMMUNITY TAS GAWA AVATAR COMPONENT */}
                  <CardContent>
                    {/* <UserAvatar user={user} /> */}
                    <div className="flex flex-col justify-center">
                      {userSearch ? (
                        //@ts-ignore
                        <h3 className="font-semibold">{user.name} {" "} {user.lastName}</h3>
                      ) : (
                        <h3 className="font-semibold">{otherParticipant?.name} {" "} {otherParticipant?.lastName}</h3>
                      )}
                      {/* <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                            {lastMessage ? lastMessage.content : 'No messages yet'}
                                            No messages yet
                                        </p> */}
                    </div>
                  </CardContent>
                </Card>
                /* </div> */
              );
            })}
          </div>
        </aside>


        <section className="flex flex-col w-full">
          <header className="border-b dark:border-zinc-700 p-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              {otherParticipant?.name} {" "} {otherParticipant?.lastName}
            </h2>
          </header>
          <main className="flex-1 overflow-auto p-4" onScroll={handleScroll}>
            {isFetchingNextPage && (
              <div className="w-full items-center">Loading more messages...</div>
            )}
            {messages?.pages
              ?.slice()
              .reverse()
              .map((group, index) => (
                <div key={index} className="space-y-4">
                  {group.messages
                    ?.slice()
                    .reverse()
                    .map((message, index) => (
                      <div className="space-y-4" key={index}>
                        {message.senderId === userId ? (
                          <div className="flex items-start gap-2 justify-end w-[-50%] xl:ml-[25rem] lg:ml-[20rem] md:ml-[15rem] ml-[10rem]">
                            {message.image ? (
                              <div className="flex items-center gap-4">
                                <AlertDialog>
                                  <AlertDialogTrigger className="cursor-pointer">
                                    <Trash2 className="text-rose-500 w-5 h-5" />
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this
                                      message?
                                    </AlertDialogDescription>

                                    <AlertDialogFooter>
                                      <AlertDialogCancel
                                        asChild
                                        className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 outline outline-1 outline-zinc-300 active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900"
                                      >
                                        <Button variant="outline">Cancel</Button>
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        asChild
                                        className="bg-lime-500"
                                      >
                                        <Button
                                          variant="destructive"
                                          onClick={() => {
                                            startTransition(() => {
                                              deleteMessage(message.id).then(
                                                (data) => {
                                                  if (data.error)
                                                    toast({
                                                      description: data.error,
                                                      variant: "destructive",
                                                    });

                                                  if (data.success) {
                                                    toast({
                                                      description: data.success,
                                                    });

                                                    queryClient.invalidateQueries(
                                                      {
                                                        queryKey: [
                                                          "messages",
                                                          chatroom.id,
                                                        ],
                                                      }
                                                    );
                                                  }
                                                }
                                              );
                                            });
                                          }}
                                        >
                                          Delete
                                        </Button>
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                <div>
                                  <Image
                                    src={message.image}
                                    alt="Sent Image"
                                    className="w-80 h-80"
                                    width={320}
                                    height={320}
                                  />
                                  <div className="rounded-b-lg bg-lime-500 text-white p-2 w-full">
                                    {/* <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger className="cursor-default"> */}
                                    <p className="text-sm break-words break-all">
                                      {message.content}
                                    </p>
                                    {/* </TooltipTrigger>
                                      <TooltipContent>
                                        {formatTime(message.createdAt)}
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider> */}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-4">
                                <AlertDialog>
                                  <AlertDialogTrigger className="cursor-pointer">
                                    <Trash2 className="text-rose-500" />
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this
                                      message?
                                    </AlertDialogDescription>

                                    <AlertDialogFooter>
                                      <AlertDialogCancel
                                        asChild
                                        className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 outline outline-1 outline-zinc-300 active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900"
                                      >
                                        <Button variant="outline">Cancel</Button>
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        asChild
                                        className="bg-lime-500"
                                      >
                                        <Button
                                          variant="destructive"
                                          onClick={() => {
                                            startTransition(() => {
                                              deleteMessage(message.id).then(
                                                (data) => {
                                                  if (data.error)
                                                    toast({
                                                      description: data.error,
                                                      variant: "destructive",
                                                    });

                                                  if (data.success) {
                                                    toast({
                                                      description: data.success,
                                                    });

                                                    queryClient.invalidateQueries(
                                                      {
                                                        queryKey: [
                                                          "messages",
                                                          chatroom.id,
                                                        ],
                                                      }
                                                    );
                                                  }
                                                }
                                              );
                                            });
                                          }}
                                        >
                                          Delete
                                        </Button>
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>

                                <div className="rounded-lg bg-lime-500 text-white p-2 w-auto">
                                  {/* <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger className="cursor-default"> */}
                                  <p className="text-sm text-wrap break-words break-all">
                                    {message.content}
                                  </p>
                                  {/* </TooltipTrigger>
                                    <TooltipContent>
                                      {formatTime(message.createdAt)}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>  */}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-start gap-2 w-[50%] xl:mr-[25rem] lg:mr-[20rem] md:mr-[15rem] mr-[10rem]">
                            {message.image ? (
                              <div>
                                <Image
                                  src={message.image}
                                  alt="Sent Image"
                                  className="max-w-xs max-h-xs"
                                  width={320}
                                  height={320}
                                />
                                <div className="rounded-lg bg-zinc-200 dark:bg-zinc-700 p-2 w-auto">
                                  {/* <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger className="cursor-default"> */}
                                  <p className="text-sm  text-wrap break-all break-word">
                                    {message.content}
                                  </p>
                                  {/* </TooltipTrigger>
                                    <TooltipContent>
                                      {formatTime(message.createdAt)}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider> */}
                                </div>
                              </div>
                            ) : (
                              // <TooltipProvider>
                              <div className="rounded-lg bg-zinc-200 dark:bg-zinc-700 p-2 w-auto">
                                {/* <Tooltip>
                                  <TooltipTrigger className="cursor-default"> */}
                                <p className="text-sm  text-wrap break-word">
                                  {message.content}
                                </p>
                                {/* </TooltipTrigger>
                                  <TooltipContent>
                                    {formatTime(message.createdAt)}
                                  </TooltipContent>
                                </Tooltip> */}
                              </div>
                              // </TooltipProvider>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ))}
            <div ref={endOfMessagesRef} />
          </main>
          <footer className="border-t dark:border-zinc-700 p-4 cursor-pointer text-muted-foreground">
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger>
                  <UploadPictureIcon />
                </DialogTrigger>
                <DialogContent>
                  {imageUrl.length ? (
                    <div className="w-full flex flex-col items-center justify-center mt-5">
                      <Image
                        alt="product image"
                        src={imageUrl}
                        width={250}
                        height={250}
                        className="mb-3"
                      />
                      <Button variant="outline" onClick={() => setImageUrl("")}>
                        Change
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h1>Upload a picture!</h1>
                      <UploadButton
                        className="text-green"
                        appearance={{
                          button: "bg-[#00B207] p-2 mb-3",
                          allowedContent:
                            "flex h-8 flex-col items-center justify-center px-2 text-green",
                        }}
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          console.log("Files: ", res);
                          if (res && res.length > 0 && res[0].url) {
                            setImageUrl(res[0].url);
                          } else {
                            console.error("Please input a valid image.", res);
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast({
                            title: "Error!",
                            description: error.message,
                            variant: "destructive",
                          });
                        }}
                      />
                    </>
                  )}
                </DialogContent>
              </Dialog>

              <Input
                className="flex-1"
                placeholder="Type a message..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <Button
                disabled={content.length < 1}
                variant="default"
                className="bg-lime-500"
                onClick={() => {
                  sendMessage(
                    chatroom.id,
                    userId,
                    content,
                    imageUrl
                  ).then((callback) => {
                    if (callback.success) {
                      setContent("");
                      setImageUrl("");
                      refetch();
                      queryClient.invalidateQueries({
                        queryKey: ["messages", chatroom.id],
                      });
                    }

                    if (callback.error) {
                      toast({
                        description: callback.error,
                        variant: "destructive",
                      });
                    }
                  });
                }}
              >
                Send
              </Button>
            </div>
          </footer>
        </section>
      </div>
    </>
  );
};


const UploadPictureIcon = () => {
  return (
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
      </svg>
    </div>
  )
}