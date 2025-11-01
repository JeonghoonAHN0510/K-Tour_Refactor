/**
 * 관리자단 > 회원관리 > 회원현황(member) 페이지 컴포넌트
 *
 * @author kimJS
 * @since 2025.10.19
 * @version 0.1.3
 */
import { useState, useEffect } from "react";
import SplitPaneResponsive from "@admin/components/common/SplitPaneResponsive"; // 반응형 스플리터
import ListSection from "@admin/pages/member/member/ListSection";               // 좌측: 목록
import DetailSection from "@admin/pages/member/member/DetailSection";           // 우측: 상세(CRUD)

export default function Member(props) {

    const [selectedMid, setSelectedMid] = useState(null);   // 좌측(ListSection) > 테이블에서 어떤 행이 선택되었는지 표시상태 (active 클래스)
    const [activeMember, setActiveMember] = useState(null); // 우측(DetailSection) > 상세 폼에 입력값 채울 선택된 회원정보 데이터

    useEffect(() => {
        // console.log("activeMember 변경:", activeMember); // !확인용
    }, [activeMember]);

    // console.log(activeMember);

    /** =========================== 회원현황 Member.jsx ============================= */
    return (
        <>
            {/* 페이지 좌/우 화면분할 */}
            <SplitPaneResponsive
                initLeftPct={50}              // 초기 좌측 폭(%)
                minLeftPx={240}               // 좌측 최소(px)
                minRightPx={320}              // 우측 최소(px)

                //** 1. 좌측 콘텐츠(목록/검색) */ 
                left={<ListSection
                    activeMember={activeMember}
                    setActiveMember={setActiveMember}
                    selectedMid={selectedMid}
                    setSelectedMid={setSelectedMid}
                />}
                //** 2. 우측 콘텐츠(상세정보/CRUD) */        
                right={<DetailSection
                    activeMember={activeMember}
                />}
            />
        </>
    );
}//Member.jsx end