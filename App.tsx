
import React, { useState, useMemo } from 'react';
import { INITIAL_CHECKLIST_DATA, Icons } from './constants';
import { ChecklistItem, Status } from './types';

const App: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST_DATA);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleStatus = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        let nextStatus = Status.PENDING;
        if (item.status === Status.PENDING) nextStatus = Status.READY;
        else if (item.status === Status.READY) nextStatus = Status.INCOMPLETE;
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const getRowSpan = (index: number, columnKey: 'category2' | 'category3' | 'category4') => {
    const currentValue = items[index][columnKey];
    // 특수 병합 행인 경우 rowSpan은 1로 고정
    if (items[index].category3 === 'COLSPAN_4') return 1;
    
    if (index > 0 && items[index - 1][columnKey] === currentValue && currentValue !== '') {
      return 0; 
    }
    
    let span = 1;
    for (let i = index + 1; i < items.length; i++) {
      if (items[i][columnKey] === currentValue && currentValue !== '') {
        span++;
      } else {
        break;
      }
    }
    return span;
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.requiredDocs.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category2 || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category3 || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24 selection:bg-blue-100">
      <nav className="bg-white border-b-[3px] border-black sticky top-0 z-[60] no-print px-8 py-5 shadow-sm">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded flex items-center justify-center transform rotate-3 shadow-lg">
              <Icons.FileText className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-[900] text-black tracking-tight">원가보전 신청 서류 관리 마스터</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="서류 이름 또는 내용 검색..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 bg-slate-50 border-2 border-slate-200 rounded-full text-sm focus:border-black focus:ring-0 outline-none transition-all w-80 font-medium"
              />
            </div>
            <button 
              onClick={() => window.print()}
              className="bg-black text-white px-8 py-3 rounded-full text-sm font-black flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl active:scale-95"
            >
              <Icons.Printer className="w-5 h-5" /> PDF 출력
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-8 mt-16">
        <div className="bg-white border-[3px] border-black overflow-hidden shadow-[20px_20px_0px_rgba(0,0,0,0.05)]">
          <table className="w-full text-[15px] border-collapse table-fixed leading-tight">
            <thead>
              <tr className="border-b-[3px] border-black text-center font-[900] bg-slate-100 text-black h-14">
                <th className="p-3 border-r-2 border-black w-[10%]">구분 1</th>
                <th className="p-3 border-r-2 border-black w-[10%]">구분 2</th>
                <th className="p-3 border-r-2 border-black w-[27%]">서류 및 준비자료</th>
                <th className="p-3 border-r-2 border-black w-[45%]">상세 설명</th>
                <th className="p-3 w-[8%]">상태</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => {
                const rs3 = getRowSpan(index, 'category3');
                const rs4 = getRowSpan(index, 'category4');
                
                // 특수 병합 행 (조직기구표 등) 여부 확인
                const isSpecialRow = item.category3 === 'COLSPAN_4';

                return (
                  <tr key={item.id} className="border-b-2 border-black hover:bg-slate-50/80 transition-colors">
                    {/* 특수 행일 경우: 가운데 정렬로 변경 요청 반영 */}
                    {isSpecialRow ? (
                      <td 
                        colSpan={3}
                        className="p-5 align-middle border-r-2 border-black font-[800] text-center text-black bg-white text-[16px]"
                      >
                        {item.category2}
                      </td>
                    ) : (
                      <>
                        {/* 일반 행: 구분 1 (Category 3) */}
                        {rs3 > 0 && (
                          <td 
                            rowSpan={rs3} 
                            className="p-4 text-center align-middle border-r-2 border-black font-[800] text-slate-800 whitespace-pre-wrap leading-tight bg-white"
                          >
                            {item.category3}
                          </td>
                        )}
                        {/* 일반 행: 구분 2 (Category 4) */}
                        {rs4 > 0 && (
                          <td 
                            rowSpan={rs4}
                            className="p-4 text-center align-middle border-r-2 border-black text-slate-600 font-semibold bg-white"
                          >
                            {item.category4}
                          </td>
                        )}
                        {/* 일반 행: 서류명 */}
                        <td className="p-5 align-top border-r-2 border-black font-[800] text-black">
                          <div className="flex items-start gap-2">
                            <span className="text-black mt-0.5">•</span>
                            <span>{item.requiredDocs}</span>
                          </div>
                        </td>
                      </>
                    )}

                    {/* 상세 설명 - 칸 너비 확대(45%)를 통해 줄바꿈 최적화 */}
                    <td className="p-5 align-top border-r-2 border-black text-slate-700 whitespace-pre-wrap leading-relaxed text-[14px]">
                      {item.description}
                    </td>

                    {/* 준비 상태 - 공통 */}
                    <td className="p-4 text-center align-middle">
                      <button
                        onClick={() => toggleStatus(item.id)}
                        className={`
                          mx-auto w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-300
                          ${item.status === Status.READY 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                            : item.status === Status.INCOMPLETE 
                              ? 'bg-red-500 border-red-500 text-white shadow-lg' 
                              : 'bg-white border-slate-200 text-slate-200 hover:border-black hover:text-black hover:scale-110'}
                        `}
                      >
                        {item.status === Status.READY ? <Icons.Check className="w-6 h-6" /> : 
                         item.status === Status.INCOMPLETE ? <Icons.Alert className="w-6 h-6" /> : null}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-between items-center no-print">
          <div className="flex gap-6">
            <div className="flex items-center gap-2 font-bold text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
               <div className="w-3 h-3 bg-blue-600 rounded-full"></div> 준비 완료
            </div>
            <div className="flex items-center gap-2 font-bold text-sm text-red-500 bg-red-50 px-4 py-2 rounded-full border border-red-100">
               <div className="w-3 h-3 bg-red-500 rounded-full"></div> 보완 필요
            </div>
          </div>
          <p className="text-sm font-bold text-slate-400 tracking-tight">※ 모든 서류는 최신 회계연도 기준 직인 날인이 원칙입니다.</p>
        </div>
      </main>

      <footer className="mt-28 border-t-2 border-slate-100 py-16 no-print bg-white">
        <div className="max-w-[1200px] mx-auto px-8 text-center">
          <div className="w-12 h-1 bg-slate-100 mx-auto"></div>
        </div>
      </footer>
    </div>
  );
};

export default App;
