/**
 * 관리자단 > 사이트 관리 > 푸시/팝업관리 > 상세 섹션 컴포넌트
 *
 * @author juju9595
 * @since 2025.10.21
 * @version 0.1.0
 */

import { useState , useMemo, useEffect, useRef} from "react";
import axios from "axios";

// 날짜/시간 헬퍼
const toDate = (v) => (v ? String(v).slice(0, 10) : "");
const toDateTimeStart = (yyyyMMdd) => (yyyyMMdd ? `${yyyyMMdd} 00:00:00` : null);
const toDateTimeEnd = (yyyyMMdd) => (yyyyMMdd ? `${yyyyMMdd} 23:59:59` : null);
const serverImgUrl = (ppImg) =>
  ppImg ? `http://localhost:5173/uploads/1/ppImg/${encodeURIComponent(ppImg)}` : "";

// 서버 기대값(예: 1/2/3)과 UI값(0/1/2) 매핑
const normalizeUse = (v) => {
  if (v === "0") return "1";
  if (v === "1") return "2";
  if (v === "2") return "3";
  return v ?? "";
};


export default function DetailSection(props) {

    console.log( props );
    
         const {
            selected = null,     // 부모에서 내려주는 선택 데이터(목록에서 클릭)
            onSaved,             // (옵션) 저장 후 콜백
            onDeleted,            // (옵션) 삭제 후 콜백
            loginMgNo
        } = props;

        //[1] 입력받은 데이터들을 관리하는 useState
        const [ppNo, setppNo] = useState(null); // 존재하면 수정/삭제 모드
        const [pNo, setpNo] = useState("");
        const [mgNo, setmgNo] = useState("");
        const [ppTitle, setppTitle] = useState("");
        const [ppContent, setppContent] = useState("");
        const [ppImg, setppImg] = useState("");
        const [ppUse, setppUse] = useState("");
        const [ppType, setppType] = useState("");

        // date input 은 yyyy-MM-dd 이므로 백엔드가 datetime이면 전송 전에 보정
        const [ppStartDate, setppStartDate] = useState(""); // yyyy-MM-dd
        const [ppEndDate, setppEndDate] = useState("");     // yyyy-MM-dd
        const [ppIteratedDate, setppIteratedDate] = useState(""); //HH:mm

        const [createdAt, setCreatedAt] = useState("");
        const [updatedAt, setUpdatedAt] = useState("");

        const [uploadFile, setUploadFile] = useState(null);
        const [previewUrl, setPreviewUrl] = useState(""); // ← 미리보기 전용(URL)
        const [fileKey, setFileKey] = useState(0);        // ← 파일 input 리셋용 key
        const fileRef = useRef(null);

        //!! (두 개의 느낌표)는 Boolean 강제 변환 연산자 true/false
        const isEdit = useMemo(() => !!ppNo, [ppNo])
        

        // [1-1] 폼 초기화 함수 (세터 이름 정확히!)
        const resetForm = () => {
            setppNo(null);
            setpNo("");
            setmgNo("");
            setppTitle("");
            setppContent("");
            setppImg("");
            setppUse("");
            setppType("");
            setppStartDate("");
            setppEndDate("");
            setppIteratedDate("");
            setCreatedAt("");
            setUpdatedAt("");
            setUploadFile(null);
           
            //미리보기 초기화
            setUploadFile(null);
            setPreviewUrl("");     // ← 미리보기 초기화
            setTitle("");
            if (fileRef.current) fileRef.current.value = "";
            setFileKey(k => k + 1); // ← 파일 input 리셋
        };

        // [2] selected 바인딩
        useEffect(() => {
          // 선택 변경시 이전 미리보기 정리
          if(previewUrl){
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl("");
          }

          if (fileRef.current) fileRef.current.value = "";
          setFileKey(k => k + 1);                 // ← 파일 input 리셋


          if(fileRef.current) fileRef.current.value = "";
          
            if (!selected) {
            resetForm();
            return;
            }
            setppNo(selected.ppNo ?? null);
            setpNo(selected?.pNo != null ? String(selected.pNo) : ""); // 빈문자/문자열로
            setmgNo(selected.mgNo ?? "");
            setppTitle(selected.ppTitle ?? "");
            setppContent(selected.ppContent ?? "");
            setppImg(selected.ppImg ?? "");
            setppUse(selected.ppUse ?? "");
            setppType(selected.ppType ?? "");
            setppStartDate(toDate(selected.ppStart));
            setppEndDate(toDate(selected.ppEnd));
            setppIteratedDate(                                     // [FIX] "HH:mm:ss" → "HH:mm"
            selected.ppIterated ? String(selected.ppIterated).slice(0, 5) : "")
            setCreatedAt(selected.createdAt ?? "");
            setUpdatedAt(selected.updatedAt ?? "");
            setUploadFile(null);
            setTitle("");
            if (fileRef.current) fileRef.current.value = "";
            // ★ 선택 항목의 서버 이미지로 미리보기 세팅
            setPreviewUrl(serverImgUrl(selected.ppImg));
        }, [selected]);

      useEffect(() => {
        if (ppNo && selected) {       // 수정 모드일 때만 실행
          setTitle(selected.placeTitle ?? selected.title ?? ""); // DTO에 따라 필드명 조정
        }
      }, [ppNo, selected]);

      const normalizePnoForSend = () => {
        // 1) 입력칸 값 우선
        const raw = (pNo ?? "").toString().trim();
        if (raw !== "" && /^\d+$/.test(raw)) return raw;          // 숫자만 허용
        // 2) 선택행(selected)의 pNo도 "숫자일 때만" 채택
        const sel = selected?.pNo;
        if (sel !== null && sel !== undefined) {
          const selStr = String(sel).trim();
          if (selStr !== "" && /^\d+$/.test(selStr)) return selStr;
        }

        // 3) 정말 없으면 null (이 경우는 등록에서만 허용, 수정이면 에러 가이드)
        return null;
      };



  // 수정용 JSON 페이로드
  const buildPayload = () => ({
    ...(ppNo ? { ppNo } : {}),
    pNo: normalizePnoForSend(),                                // [FIX] "null"이 append되지 않게 사전 보정
    mgNo: mgNo || loginMgNo || null,
    ppTitle: ppTitle || null,
    ppContent: ppContent || null,
    ppImg: ppImg || null,
    ppUse: normalizeUse(ppUse), 
    ppType: ppType || null,
    ppStart: toDateTimeStart(ppStartDate),
    ppEnd: toDateTimeEnd(ppEndDate),
    ppIterated: ppIteratedDate                               // [FIX] "HH:mm" → "HH:mm:ss"
    ? (ppIteratedDate.length === 5 ? `${ppIteratedDate}:00` : ppIteratedDate)
    : null,
  });

  // 저장(등록/수정)
  const save = async () => {
    try {
      if (isEdit) {
        // --- 수정(@RequestPart("dto"), file)
        const dto = buildPayload();
        const fd = new FormData();
        fd.append("ppNo", ppNo);
        fd.append("mgNo", dto.mgNo);
        if (dto.pNo != null && dto.pNo !== "") fd.append("pNo", String(dto.pNo));
        fd.append("ppContent", dto.ppContent);
        fd.append("ppEnd", dto.ppEnd);
        fd.append("ppImg", dto.ppImg);
        fd.append("ppIterated", dto.ppIterated);
        fd.append("ppStart", dto.ppStart);
        fd.append("ppTitle", dto.ppTitle);
        fd.append("ppType", dto.ppType);
        fd.append("ppUse", dto.ppUse);
        if (uploadFile) fd.append("file", uploadFile);

        console.log(uploadFile);
        console.log(fd);

        const res = await axios.put("http://localhost:8080/push/update", fd, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("[수정 결과]", res.data);
        onSaved?.();
        alert("수정되었습니다.");
        location.href = "/admin/site/push_popup";
      } else {
        // --- 등록(@RequestPart("dto"), file)
                console.log( pNo );
        const dto = buildPayload();

        const fd = new FormData();

        console.log( dto );

        //fd.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));
        fd.append("mgNo", dto.mgNo);
        fd.append("pNo", dto.pNo);
        if (dto.pNo != null && dto.pNo !== "") fd.append("pNo", String(dto.pNo));
        fd.append("ppContent", dto.ppContent);
        fd.append("ppEnd", dto.ppEnd);
        fd.append("ppImg", dto.ppImg);
        fd.append("ppIterated", dto.ppIterated);
        fd.append("ppStart", dto.ppStart);
        fd.append("ppTitle", dto.ppTitle);
        fd.append("ppType", dto.ppType);
        fd.append("ppUse", dto.ppUse);
        if (uploadFile) fd.append("file", uploadFile);

        console.log( uploadFile )
        console.log( fd )

        const res = await axios.post("http://localhost:8080/push/add", fd, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("[등록 결과]", res.data);

        // 요구사항: 등록 후 입력 내용 초기화
        resetForm();
        onSaved?.();
        alert("등록되었습니다.");
      }

    } catch (e) {
      console.error("[저장 실패]", e);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // 삭제
  const remove = async () => {
    if (!isEdit) return alert("삭제할 대상이 없습니다.");
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const res = await axios.delete("http://localhost:8080/push/delete", {
        withCredentials: true,
        params: { ppNo },
      });
      if (res.data === true) {
        alert("삭제되었습니다.");
        resetForm();
        onDeleted?.();
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (e) {
      console.error("[삭제 실패]", e);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const makeNew = () => resetForm();


  // 검색 버튼 클릭 시 호출될 함수
  const [ title , setTitle ] = useState("");
  const handleSearch = async () => {
    try {
      // pNo를 Spring 컨트롤러로 GET 요청
      const response = await axios.get(`http://localhost:8080/push/searchPlace`, {
        params: { pNo: pNo }
      });
      console.log("검색 결과:", response.data);
      setTitle(response.data);
    } catch (err) {
      console.error("검색 오류:", err);
      alert("검색 실패!");
    }
  };

    /** =================== 관리자단 > 사이트관리 > 푸시/팝업관리(PushPopup) 상세 섹션 컴포넌트.jsx영역 ======================= */
    return (
        <>
            {/* <!-- CUD.등록/수정 시작 --> */}
            <section className="registWrap">
                {/* <!-- CUD.타이틀/버튼 시작 --> */}
                <div className="titleBox">
                    <ul className="tabtitle">
                        <li className="active">기본정보</li>
                    </ul>
                    <span className="btnBox">
                        <button type="button" className="btn full" onClick={save} disabled={!isEdit && !(pNo && /^\d+$/.test(String(pNo)))}>저장</button>
                        <button onClick={remove} type="button" className="btn line" >삭제</button>
                        <button onClick={makeNew} type="button" className="btn line" >신규등록</button>
                    </span>
                </div>
                {/* <!-- CUD.타이틀/버튼 끝 --> */}
                {/* <!-- CUD.입/출력단 시작 --> */}
                <div className="formWrap">
                    <h2>{ppTitle || (ppNo ? `#${ppNo}` : "상세")}</h2>
                    <form action="#" method="post" id="userForm" onSubmit={(e) => e.preventDefault()}>
                        <fieldset>
                            <label htmlFor="memberTypeInput"><b>사용구분</b>
                                <select className="memberTypeInput" 
                                value={ppUse}
                                onChange={(e) => setppUse(e.target.value)}>
                                    <option value="" >전체</option>
                                    <option value="0">푸시알림+팝업</option>
                                    <option value="1">푸시알림</option>
                                    <option value="2">팝업</option>
                                </select>
                            </label>
                            <label for="memberTypeInput"><b>카테고리</b>
                                <select className="memberTypeInput" value={ppType} onChange={(e) => setppType(e.target.value)}>
                                    <option value="">전체</option>
                                    <option value="1">공지</option>
                                    <option value="2">이벤트</option>
                                </select>
                            </label><br />
                            {/* <label for="subsStatusInput"><b>노출상태</b>
                                <select className="subsStatusInput">
                                    <option value="" selected>전체</option>
                                    <option value="1">진행전</option>
                                    <option value="2">진행중</option>
                                    <option value="3">진행완료</option>
                                </select>
                            </label><br /> */}
                            <label for="emailInput"><b>노출시작일</b><input type="date" className="emailInput" value={ppStartDate}
                            onChange={(e) => setppStartDate(e.target.value)} name="emailInput" required placeholder="노출 시작일" /></label>
                            <label for="birthInput"><b>노출종료일</b><input type="date" className="birthInput" value={ppEndDate}
                            onChange={(e) => setppEndDate(e.target.value)}
                                name="birthInput" placeholder="노출 종료일" /></label>
                            <span><br />
                                <label for="genderMaleInput"><b>푸시알림시간</b>
                                  <input className="genderInput" type="time" step="3600"      // [FIX] 1시간 단위
                                  value={ppIteratedDate}                                    // 항상 "HH:mm"
                                  onChange={(e) => {
                                    const [hour] = String(e.target.value || "").split(":");
                                    setppIteratedDate(`${String(hour ?? "00").padStart(2,"0")}:00`); // "HH:00"
                                  }} />
                                </label>
                            </span> 
                            <br />
                            <label for="nameInput"><b>플레이스번호</b><button type="button" onClick={ handleSearch } disabled={!!ppNo && selected?.pNo != null} >검색</button><input className="nameInput" type="text"
                                placeholder="플레이스No"  value={pNo} onChange={(e) => setpNo(e.target.value)} readOnly={!!ppNo && selected?.pNo != null} style={{
                                backgroundColor: isEdit ? "#f6f6f6" : "white", // 수정모드일 때 회색 처리
                                
                              }}  />
                            </label>
                            <label for="nameInput"><b>플레이스명</b><input className="nameInput" type="text"
                                placeholder="불러온 플레이스 명을 노출" value= { title } readOnly={true} style={{
                                backgroundColor: isEdit ? "#f6f6f6" : "white"}} />
                                </label><button type="button" onClick={() => alert("플레이스 정보 보기 예정")}>정보보기</button>
                            <br />
                            <label for="nameInput"><b>제목</b><input className="nameInput" type="text" value={ppTitle}
                            onChange={(e) => setppTitle(e.target.value)}
                                placeholder="제목" /></label>
                            <br />
                            <label for="loginIdInput"><b>내용</b>
                                <textarea value={ppContent} onChange={(e) => setppContent(e.target.value)}></textarea>
                            </label><br />
                            <label for="nameInput"><b>링크연결(url)</b><input className="nameInput" type="text"
                                placeholder="링크연결주소(url)" /></label><br />
                            <label for=""><b>팝업이미지</b><input className=""
                                key={fileKey} //<- 파일 input 리셋 핵심
                                ref={fileRef}
                                type="file" 
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setUploadFile(file);
                                    setppImg("");                      // 새 파일 올릴 것이므로 서버 파일명 무효화
                                    setPreviewUrl(URL.createObjectURL(file)); // ← 미리보기는 blob URL만 사용
                                }}/></label>
                            <div className="info_date">*이미지 사이즈: 800px(가로) * 600px(세로) 권장, 이미지 파일확장자 : jpg/png/gif </div>
                            <img
                                src={ previewUrl || serverImgUrl(ppImg) || "https://placehold.co/800x600/EEE/31343C" }
                                onError={(e) => { e.currentTarget.src = "https://placehold.co/800x600/EEE/31343C"; }}
                                alt="preview"
                                style={{ width: "100%" }} /><br />

                        </fieldset>
                    </form>
                    <label for="nameInput"><b>작성자</b><input className="nameInput" type="text" placeholder="로그인한 작성자 " value={selected?.mgNo || loginMgNo || ""}
                    readOnly /></label>
                    <br />
                    <div className="info_date"><b>등록일:</b>2025-00-00 (00:00:00)<b>수정일:</b>2025-00-00 (00:00:00)</div>
                </div>
                {/* <!-- CUD.입/출력단 시작 --> */}
            </section>
            {/* <!-- CUD.등록/수정 끝 --> */}
        </>
    );
}//PushPopup.jsx end
