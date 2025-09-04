import { Suspense } from 'react';
import ChatRoomClient from '../../../components/chat/room/ChatRoomClient';

export default function Page() {
  return (
    /**
     * Next.js App Router에서 useSearchParams, usePathname 같은 클라이언트 훅을 사용하면,
     * 빌드 시점(=서버에서 미리 렌더링할 때)은 값이 없어서 “지금은 클라이언트에서만 알 수 있어” 하고 CSR로 전환합니다.
     * 이걸 React는 suspense (일시 중단) 처리라고 부릅니다.
     *
     * 즉, “데이터가 아직 없으니 잠깐 기다려 → 클라이언트에서 값 채우고 다시 렌더” 하는 과정이 필요하고,
     * 그 잠깐 기다리는 동안 뭘 보여줄지 <Suspense> 경계가 결정해주는 거예요.
     *
     * <Suspense>: “안에 있는 컴포넌트가 준비 안 됐을 때” 대신 보여줄 걸 지정.
     * fallback: 준비 안 됐을 때 보여줄 UI (로딩 메시지, 스피너 등).
     * ChatRoomClient: 내부에서 useSearchParams()를 쓰는 클라이언트 컴포넌트.
     */
    <Suspense fallback={<div>Loading...</div>}>
      <ChatRoomClient />
    </Suspense>
  );
}
