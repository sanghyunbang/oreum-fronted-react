import PointerSection from './detailView/PointerSection';
import FinalPointer from './detailView/FinalPointer';

export default function CurationDetailView({ segments }) {
  console.log("📦 segments in CurationDetailView:", segments);

  if (!segments || Object.entries(segments).length === 0) {
    return <p className="text-sm text-gray-500">작성된 큐레이션이 없습니다.</p>;
  }

  // segmentKey 기준으로 정렬된 entries
  const sortedEntries = Object.entries(segments).sort((a, b) => Number(a[0]) - Number(b[0]));

  const sections = sortedEntries.filter(([_, seg]) => Number(seg.segmentKey) % 2 === 0);
  const pointers = sortedEntries.filter(([_, seg]) => Number(seg.segmentKey) % 2 === 1);

  return (
    <div className="relative ml-5">
      <div className="space-y-10">
        {sections.map(([sectionKey, section], idx) => {
          const pointerKey = (Number(section.segmentKey) - 1).toString();
          const pointer = segments[pointerKey];

          return (
            <PointerSection
              key={sectionKey}
              index={idx}
              // keyId={sectionKey}
              pointerName={pointer?.pointerName || ''}
              section={section}
              pointer={pointer} // pointer도 넘겨야 함

            />
          );
        })}

        {/* 마지막 pointer 렌더링 */}
        {pointers.length > 0 && (
          <FinalPointer
            pointer={pointers[pointers.length - 1][1]}
            pointerIndex={pointers.length}
          />
        )}
      </div>
    </div>
  );
}

