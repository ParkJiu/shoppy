import { useEffect } from "react";
import { useLoginApi } from "../context/LoginContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAdmin }) {
  const { user } = useLoginApi();
  /**
   * 로그인한 사용자가 있는지 확인
   * 그 사용자가 어드민 권한이 있는지 확인
   * requireAdmin이 true인 경우 로그인도 되어있어야 하고, 어드민 권한도 가지고 있어야 함
   * 조건에 맞지 않으면 / 상위 경로로 이동
   * 조건에 맞는 경우에만 전달된 children을 보여줌
   */

  if (!user || (requireAdmin && !user.isAdmin)) {
    alert("잘못된 접근입니다. 메인페이지로 이동합니다.");
    return <Navigate to='/' replace />;
  }
  return children;
}
