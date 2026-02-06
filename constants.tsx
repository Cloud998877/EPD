
import { ChecklistItem, Status } from './types';

export const INITIAL_CHECKLIST_DATA: ChecklistItem[] = [
  {
    id: '1',
    category1: '',
    category2: '총원가',
    category3: '제조(수입)\n원가',
    category4: '상품매입액',
    requiredDocs: '상품 수입(구매) 단가: 최근 사업연도말 상품 재고자산 수불부',
    description: '• 최근(또는 최종) 사업연도 기준 재고 현황 자료',
    status: Status.READY
  },
  {
    id: '2',
    category1: '',
    category2: '총원가',
    category3: '제조(수입)\n원가',
    category4: '상품매입액',
    requiredDocs: '상품 연간 수입(구매) 내역',
    description: '• 상품 수입면장(수입신고필증), 은행 송금내역, invoice/거래명세서/세금계산서 등\n• 최종 구매시 뿐만 아니라 상품구매내역에 있는 모든 구매내역 자료\n※ 매입경비의 경우 수입신고필증의 신고번호, B/L 번호 등으로 확인 가능해야 함',
    status: Status.PENDING
  },
  {
    id: '3',
    category1: '',
    category2: '총원가',
    category3: '제조(수입)\n원가',
    category4: '경비',
    requiredDocs: '수입 부대경비',
    description: '예) 운반비, 창고사용료, 관세사 용역 수수료 등 비용과 증빙서류 (계산서)\n기타 제품수입과 직접 연관이 있다고 판단되는 비용과 증빙가능 서류\n※ 운반비 등은 해당제품 관련을 입증할 경우 경비로 인정 검토',
    status: Status.PENDING
  },
  {
    id: '4',
    category1: '',
    category2: '• 조직기구표',
    category3: 'COLSPAN_4', // 1~4열을 하나로 합침
    category4: '',
    requiredDocs: '',
    description: '• 최근 사업연도말 기준 시작월(1월)과 마지막월(12월)의 회사 조직구조 및 인력현황 (회사양식)',
    status: Status.PENDING
  },
  {
    id: '5',
    category1: '',
    category2: '• 결산서(감사보고서)',
    category3: 'COLSPAN_4',
    category4: '',
    requiredDocs: '',
    description: '• 최근 사업연도의 손익계산서, 재무상태표',
    status: Status.PENDING
  },
  {
    id: '6',
    category1: '',
    category2: '• 법인세 세무조정계산서',
    category3: 'COLSPAN_4',
    category4: '',
    requiredDocs: '',
    description: '• 중소기업기준검토표 포함',
    status: Status.PENDING
  },
  {
    id: '7',
    category1: '',
    category2: '• 수입품목허가증',
    category3: 'COLSPAN_4',
    category4: '',
    requiredDocs: '',
    description: '• 식약처 허가사항 확인',
    status: Status.PENDING
  },
  {
    id: '8',
    category1: '',
    category2: '• 연간판매실적 (회사양식)',
    category3: 'COLSPAN_4',
    category4: '',
    requiredDocs: '',
    description: '• 최근 사업연도의 매출 요약자료 (회사양식)',
    status: Status.PENDING
  }
];

export const QUICK_QUESTIONS = [
  "조직기구표의 인력현황 작성 방법",
  "감사보고서 외에 가결산 재무제표 인정 여부",
  "세무조정계산서 필수 포함 페이지",
  "수입품목허가증의 효능효과 확인"
];

export const Icons = {
  Check: ({className}: {className?: string}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
  ),
  Alert: ({className}: {className?: string}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
  ),
  Search: ({className}: {className?: string}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
  ),
  Sparkles: ({className}: {className?: string}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
  ),
  Printer: ({className}: {className?: string}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
  ),
  FileText: ({className}: {className?: string}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
  )
};
