import {useState, useRef, useEffect} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate, useNavigate } from "react-router-dom";

export default function CurationSideBar({onPostResult}) {

    const navigate = useNavigate();
    
    // 백과 통신할 내용들 묶어 놓은 부분[wp 동일 --> 훅이나 컴포넌트로 몰아서 사용하게 정리 가능]
    const [postdata, setPostdata] = useState({
    userId: "",
    nickname: "",
    boardId: "",
    type: "curation",
    title: "",
    content: "",
    mountainName: "",
    route: "",
    caution: "",
    nearbyAttraction: "",
    meetingDate: "",
    meetingLocation: ""
    });

    // 미디어 정보 담는 칸[wp 동일]
    const [files, setFiles] = useState([]);

    // 서브 커뮤니티 표출 부분[wp 동일]
    const [boards, setBoards] = useState([]);

    // 검색 산 이름 정보 상태 변환[wp 동일]
    const [mountainName, setMountainName] = useState("");
  
    // route 좌표 받을 곳 -> 마커 표시 찍히는 지점들 받는 곳[wp 동일]
    const [hikingCourse, setHikingCourse] = useState("");

    // 미디어 관련 파일들 담는 곳[wp 동일]
    const loadMedia = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        addFiles(droppedFiles);
    }
  
    // 미디어 항목들 업로드 되면 담아 놓는 함수 (->loadMedia에서 호출되서 사용)[wp 동일]
    const addFiles = (newFiles) => {
        const validFiles = newFiles.filter((file) => 
        file.type.startsWith("image/") || file.type === "video/mp4"
    );
    setFiles((prev) => [...prev, ...validFiles]);
  };

    // 파일 올리던거 취소하기[wp 동일]
    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    }

    /**
     파일 올리는 거 관련
     */
    const dropRef = useRef();
    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        addFiles(droppedFiles);
    };


    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        addFiles(selectedFiles);
    };

  
    // 유저 정보 가져오기 (쿠키 기반)[wp 동일]
    useEffect(() => {
        const fetchUserInfo = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/user", {
            credentials: "include", // 쿠키 전달
            });

            if (!res.ok) throw new Error("유저 정보 조회 실패");

            const data = await res.json(); // { userId, nickname, ... }

            setPostdata((prev) => ({
                ...prev,
                userId: data.userId,
                nickname: data.nickname,
            }));

        } catch (err) {
            console.error("유저 정보 가져오기 실패:", err);
        }
        };
        
        const fetchBoards = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/community/list", {
                credentials: "include",
            });
            if (!res.ok) throw new Error("게시판 목록 불러오기 실패");

            const data = await res.json(); // 예: [{ id, title, thumbnailUrl }]
            setBoards(data);
        
        } catch (err) {
            console.error("게시판 불러오기 실패:", err);
        }
    };

        fetchUserInfo();
        fetchBoards();
    }, []);

    // 이 부분은 curation만 관련 -> [글 등록]
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        files.forEach((file) => formData.append("media",file));

        // 산이름 추가
        postdata.mountainName = mountainName;
        // 좌표 정보 추가
        postdata.route = hikingCourse;

        // 서브커뮤니티 등록 확인 및 id타입 변환(string->정수)
        if (!postdata.boardId){
            alert("게시판을 선택하세요.")
            return;
        }

        const finalPost = {
            ...postdata,
            boardId: parseInt(postdata.boardId, 10),
        };

        formData.append("post", new Blob([JSON.stringify(finalPost)], { type: "application/json "}));

        try {
            const res = await fetch("http://localhost:8080/posts/insert", {
                method: "POST",
                body: formData,
                credentials: "include",
            })

            const result = await res.text();
            alert(`응답: ${result}`);
            
            // navigate를 본인이 쓴 글의 상세 페이지로?--> 수정할듯
            // navigate("/mainboard");
        } catch (e) {
            console.error(e);
            alert("글 등록 실패");
        }
    }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">게시글 작성</h2>

      {/* 게시글 유형 */}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">게시글 유형</label>
        <select
          value={postdata.type}
          onChange={(e) => setPostdata({ ...postdata, type: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="curation">큐레이션게시글</option>
        </select>
      </div>

      {/* 제목 */}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">제목</label>
        <input
          type="text"
          value={postdata.title}
          onChange={(e) => setPostdata({ ...postdata, title: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      {/* 게시판 선택 */}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">게시판 선택</label>
        <select
          value={postdata.boardId}
          onChange={(e) =>{
            setPostdata({ ...postdata, boardId: e.target.value });
          }}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        >
          <option value="">게시판을 선택하세요</option>
          {boards?.map?.((board) => (
            <option key={board.boardId} value={board.boardId}>
              {board.thumbnailUrl || "🏕️"} {board.title}
            </option>
          ))}
        </select>
      </div>

      {/* 작성자 */}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">작성자</label>
        <input
          type="text"
          value={postdata.nickname}
          readOnly
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {/* 큐레이션 필드 */}
      {postdata.type === "curation" && (
        <>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">산 이름</label>
            <input
              type="text"
              value={mountainName}
              onChange={(e) => setMountainName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">등산 코스</label>
            <input
              type="text"
              value={hikingCourse}
              onChange={(e) => setHikingCourse(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
        </>
      )}


      {/* 에디터 */}
      <div className="mb-12">
        <label className="block mb-2 font-medium text-gray-700">내용</label>
        <ReactQuill
          value={postdata.content}
          onChange={(value) => setPostdata({ ...postdata, content: value })}
          className="bg-white"
          style={{ height: "300px", marginBottom: "1rem" }}
        />
      </div>

      {/* 업로드 */}
      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => dropRef.current.querySelector("input").click()}
        className="border-2 border-dashed border-gray-400 p-6 text-center rounded cursor-pointer mb-4"
      >
        <p className="text-gray-500">이미지 또는 영상(mp4)을 드래그하거나 클릭하세요</p>
        <input
          type="file"
          accept="image/*,video/mp4"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* 미리보기 */}
      <div className="flex flex-wrap gap-3 mb-6">
        {files.map((file, index) => {
          const url = URL.createObjectURL(file);
          return (
            <div key={index} className="relative">
              {file.type.startsWith("image/") ? (
                <img src={url} alt="preview" className="w-24 h-24 object-cover rounded" />
              ) : (
                <video src={url} controls className="w-24 h-24 rounded object-cover" />
              )}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-0 right-0 bg-white text-red-500 font-bold px-1 py-0.5 rounded"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          등록
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
        >
          취소
        </button>
      </div>
    </div>
  );

}