import PointerSection from './detailView/PointerSection';
import FinalPointer from './detailView/FinalPointer';

export default function CurationDetailView({ segments }) {
  if (!segments || Object.entries(segments).length === 0) {
    return <p className="text-sm text-gray-500">작성된 큐레이션이 없습니다.</p>;
  }

  const entries = Object.entries(segments).sort((a, b) => Number(a[0]) - Number(b[0]));
  const pointersCount = Math.ceil((entries.length + 1) / 2);
  const lastPointerKey = (2 * pointersCount - 1).toString();
  const lastPointer = segments[lastPointerKey];

  return (
    <div className="relative ml-5">
      <div className="absolute top-4 bottom-0 left-3 w-1 bg-green-400 z-0" />
      <div className="space-y-10">
        {[...Array(Math.max(0, pointersCount - 1))].map((_, idx) => {
          const [key] = entries[idx];
          const pointerName = segments[2 * Number(key) - 1]?.pointerName;
          const section = segments[2 * Number(key)];
          return (
            <PointerSection
              key={key}
              index={idx}
              keyId={key}
              pointerName={pointerName}
              section={section}
            />
          );
        })}

        <FinalPointer pointer={lastPointer} pointerIndex={pointersCount} />
      </div>
    </div>
  );
}
