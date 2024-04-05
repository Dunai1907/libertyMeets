import axios from "axios";
import { useEffect, useState } from "react";
import Thread from "./Thread";
import ThreadForm from "./ThreadForm";

type PropsType = {
  appUrl: string;
  postId: number;
};
type Thread = {
  id: string;
  user_id: number;
  messages: { user_id: number; message: string }[];
};

export default function AuthorThreads({ appUrl, postId }: PropsType) {
  const [threads, setThreads] = useState<Thread[]>([]);
  useEffect(() => {
    (async () => {
      const res = await axios.get(`${appUrl}/api/threads/get-threads`, {
        params: { postId },
      });
      setThreads(res.data.data.threads);
    })();
  }, []);
  return (
    <>
      {threads.map((item) => (
        <div key={`thread-${item.id}`}>
          thread {item.id}
          <Thread appUrl={appUrl} threadId={item.id} />
          <ThreadForm
            appUrl={appUrl}
            postId={postId}
            isThreadExists
            threadId={item.id}
          />
        </div>
      ))}
    </>
  );
}
