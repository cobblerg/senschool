import { useState } from 'react'
import './index.css'

function App() {
  const [name, setName] = useState('');
  const [googleId, setGoogleId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // 사용자가 알려준 GAS URL
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxonSrYk7_Mdea6CtK86k1E0-uzLeFtADKP2zEzVjpudHLTNzOzH4LK6DE9CsD_brg/exec'; 

  const handleSearch = async (e) => {
    e.preventDefault(); // 기본 제출 동작 막기
    if (!name || !googleId) {
      setError('이름과 구글 아이디를 모두 입력해주세요!');
      return;
    }
    
    if (SCRIPT_URL === 'GAS_URL_PLACEHOLDER') {
      setError('아직 구글 앱스 스크립트 주소가 설정되지 않았습니다. AI에게 주소를 알려주세요!');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // 구글 앱스 스크립트로 데이터 전송
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ name, googleId }),
        redirect: 'follow'
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.senSchoolId);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('검색 중 오류가 발생했어요. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>🔍 센스쿨 아이디 찾기</h1>
      
      <form onSubmit={handleSearch}>
        <div className="input-group">
          <label htmlFor="name">이름</label>
          <input 
            type="text" 
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 홍길동"
            disabled={loading}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="googleId">구글 아이디</label>
          <input 
            type="text" 
            id="googleId"
            value={googleId}
            onChange={(e) => setGoogleId(e.target.value)}
            placeholder="예: gildong@snu.ms.kr"
            disabled={loading}
          />
        </div>
        
        <button type="submit" className="search-btn" disabled={loading}>
          {loading ? <span className="loader"></span> : '검색하기'}
        </button>
      </form>

      {error && <div className="error-message">⚠️ {error}</div>}

      {result && (
        <div className="result-container">
          <h2>🎉 찾았습니다!</h2>
          <div className="result-text">
            회원님의 센스쿨 아이디는<br/>
            <span className="highlight">{result}</span><br/>
            입니다.<br/><br/>
            센스쿨 링크: <a href="https://senedu.kr" target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'underline' }}><strong>senedu.kr</strong></a><br/>
            비밀번호: <strong>snumskr123</strong><br/>
            <div className="alert-message">
              ⚠️ 로그인 후 '비빌번호 변경' 메시지창에서 [확인]을 클릭한 후 snu.ms.kr 계정과 동일한 비밀번호로 변경해 주세요.<br/>
              단, 비밀번호가 10자리가 안되는 경우 비밀번호 끝에 ! 또는 !!를 붙여서 10자리를 만들어야 합니다.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
