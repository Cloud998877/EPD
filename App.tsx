
import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_CHECKLIST_DATA, Icons } from './constants';
import { ChecklistItem, Status, LogType, LogEntry } from './types';
import AIHelper from './components/AIHelper';

const App: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [newLogText, setNewLogText] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState<'엔디넥스' | '고객사'>('엔디넥스');
  
  const [notification, setNotification] = useState<{show: boolean, message: string, recipients: string[]} | null>(null);

  useEffect(() => {
    if (notification?.show) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const getStatusLabel = (status: Status) => {
    switch (status) {
      case Status.PENDING: return '';
      case Status.SUBMITTED: return '고객제출';
      case Status.SUPPLEMENT: return '보완요청';
      case Status.FINAL_READY: return '준비완료';
    }
  };

  const nextStatus = (current: Status): Status => {
    switch (current) {
      case Status.PENDING: return Status.SUBMITTED;
      case Status.SUBMITTED: return Status.SUPPLEMENT;
      case Status.SUPPLEMENT: return Status.FINAL_READY;
      case Status.FINAL_READY: return Status.PENDING;
      default: return Status.PENDING;
    }
  };

  const addLog = (itemId: string, type: LogType, content: string, author: '엔디넥스' | '고객사') => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      type,
      content,
      author,
      timestamp: new Date().toLocaleString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, logs: [newLog, ...item.logs] };
      }
      return item;
    }));
  };

  const toggleStatus = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const next = nextStatus(item.status);
        const statusText = getStatusLabel(next) || '대기';
        addLog(id, 'STATUS', `상태 변경: ${statusText}`, '엔디넥스');
        return { ...item, status: next };
      }
      return item;
    }));
  };

  const getRowSpan = (index: number, columnKey: 'category1' | 'category2') => {
    const currentValue = items[index][columnKey];
    if (currentValue === 'FULL_SPAN' || currentValue === '') return 1;
    if (index > 0 && items[index - 1][columnKey] === currentValue) return 0;
    
    let span = 1;
    for (let i = index + 1; i < items.length; i++) {
      if (items[i][columnKey] === currentValue) span++;
      else break;
    }
    return span;
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.requiredDocs.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24 selection:bg-blue-100">
      <nav className="bg-white border-b-[3px] border-black sticky top-0 z-[60] no-print px-8 py-5 shadow-sm">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-[900] text-black tracking-tight uppercase">Document Management Master</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="검색..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-full text-sm focus:border-black outline-none transition-all w-64 font-medium"
              />
            </div>
            <button onClick={() => window.print()} className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-black flex items-center gap-2">
              <Icons.Printer className="w-4 h-4" /> PDF 출력
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-8 mt-12">
        <div className="bg-white border-[2px] border-black overflow-hidden shadow-sm">
          <table className="w-full text-[13px] border-collapse table-fixed leading-tight">
            <thead>
              <tr className="border-b-[2px] border-black text-center font-[800] bg-white h-12">
                <th className="p-2 border-r-[2px] border-black w-[10%]">구분 1</th>
                <th className="p-2 border-r-[2px] border-black w-[10%]">구분 2</th>
                <th className="p-2 border-r-[2px] border-black w-[30%]">서류 및 준비자료</th>
                <th className="p-2 border-r-[2px] border-black w-[40%]">상세 설명</th>
                <th className="p-2 w-[10%]">상태</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => {
                const rs1 = getRowSpan(index, 'category1');
                const rs2 = getRowSpan(index, 'category2');
                const isFullSpan = item.category1 === 'FULL_SPAN';
                const isExpanded = expandedLogId === item.id;

                return (
                  <React.Fragment key={item.id}>
                    <tr className="border-b-[2px] border-black last:border-b-0 hover:bg-slate-50/30 transition-colors">
                      {isFullSpan ? (
                        <td colSpan={2} className="p-5 align-middle border-r-[2px] border-black font-[800] text-center text-black">
                           • {item.requiredDocs}
                        </td>
                      ) : (
                        <>
                          {rs1 > 0 && (
                            <td rowSpan={rs1} className="p-4 text-center align-middle border-r-[2px] border-black font-[800] text-black bg-white">
                              {item.category1}
                            </td>
                          )}
                          {rs2 > 0 && (
                            <td rowSpan={rs2} className="p-4 text-center align-middle border-r-[2px] border-black font-medium text-slate-800 bg-white">
                              {item.category2}
                            </td>
                          )}
                        </>
                      )}
                      
                      {!isFullSpan && (
                        <td className="p-5 align-top border-r-[2px] border-black font-[800] text-black">
                          <div className="flex items-start gap-2">
                            <span>• {item.requiredDocs}</span>
                          </div>
                          <button 
                            onClick={() => setExpandedLogId(isExpanded ? null : item.id)}
                            className="mt-4 text-[10px] font-bold text-slate-400 hover:text-black no-print flex items-center gap-1 transition-colors"
                          >
                            <Icons.History className="w-3 h-3" /> 히스토리 ({item.logs.length})
                          </button>
                        </td>
                      )}
                      
                      {isFullSpan && (
                         <td className="p-5 align-top border-r-[2px] border-black font-[800] text-black">
                            <button 
                              onClick={() => setExpandedLogId(isExpanded ? null : item.id)}
                              className="text-[10px] font-bold text-slate-400 hover:text-black no-print flex items-center gap-1 transition-colors"
                            >
                              <Icons.History className="w-3 h-3" /> 히스토리 ({item.logs.length})
                            </button>
                         </td>
                      )}

                      <td className="p-5 align-top border-r-[2px] border-black">
                        <div className="text-slate-800 whitespace-pre-wrap leading-relaxed font-medium">
                          {item.description}
                        </div>
                      </td>

                      <td className="p-2 text-center align-middle">
                        <button
                          onClick={() => toggleStatus(item.id)}
                          className={`
                            w-10 h-10 rounded-xl border-[2px] border-black flex items-center justify-center transition-all mx-auto
                            ${item.status === Status.FINAL_READY ? 'bg-[#22c55e] text-white' : 
                              item.status === Status.SUBMITTED ? 'bg-blue-500 text-white' :
                              item.status === Status.SUPPLEMENT ? 'bg-orange-500 text-white' :
                              'bg-white text-transparent'}
                          `}
                        >
                          <Icons.Check className="w-5 h-5" />
                        </button>
                        <div className="text-[10px] mt-1 font-black text-black">{getStatusLabel(item.status)}</div>
                      </td>
                    </tr>
                    
                    {isExpanded && (
                      <tr className="bg-slate-50 border-b-[2px] border-black no-print">
                        <td colSpan={5} className="p-6">
                           <div className="max-w-2xl mx-auto">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-xs font-black flex items-center gap-2"><Icons.Message className="w-3 h-3"/> 히스토리 등록</h4>
                                <div className="flex bg-slate-200 p-1 rounded-lg">
                                  <button 
                                    onClick={() => setSelectedAuthor('엔디넥스')}
                                    className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${selectedAuthor === '엔디넥스' ? 'bg-black text-white' : 'text-slate-500 hover:text-black'}`}
                                  >엔디넥스</button>
                                  <button 
                                    onClick={() => setSelectedAuthor('고객사')}
                                    className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${selectedAuthor === '고객사' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-black'}`}
                                  >고객사</button>
                                </div>
                              </div>
                              <div className="flex gap-2 mb-2">
                                <textarea 
                                  className="flex-1 p-3 text-sm border-2 border-black rounded-lg outline-none focus:ring-2 focus:ring-black/5" 
                                  placeholder={`${selectedAuthor} 명의로 내용 입력...`}
                                  value={newLogText}
                                  onChange={e => setNewLogText(e.target.value)}
                                />
                                <button 
                                  onClick={() => {
                                    if(!newLogText.trim()) return;
                                    addLog(item.id, 'SYSTEM', newLogText, selectedAuthor);
                                    setNewLogText('');
                                  }}
                                  className={`px-4 rounded-lg text-xs font-black transition-colors ${selectedAuthor === '엔디넥스' ? 'bg-black text-white hover:bg-zinc-800' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                >등록</button>
                              </div>
                              
                              <div className="space-y-3 mt-6">
                                {item.logs.length === 0 ? (
                                  <p className="text-center py-8 text-xs text-slate-400 font-medium italic">기록된 히스토리가 없습니다.</p>
                                ) : (
                                  item.logs.map(log => (
                                    <div key={log.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-black text-white ${log.author === '엔디넥스' ? 'bg-black' : 'bg-blue-600'}`}>
                                            {log.author}
                                          </span>
                                          <span className="text-[10px] text-slate-400 font-bold">{log.timestamp}</span>
                                        </div>
                                      </div>
                                      <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">{log.content}</p>
                                    </div>
                                  ))
                                )}
                              </div>
                           </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      <AIHelper />
    </div>
  );
};

export default App;
