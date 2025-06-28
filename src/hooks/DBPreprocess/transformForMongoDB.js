export default function transformForMongoDB(segments) {
  const result = [];

  for (const [key, value] of Object.entries(segments)) {
    const geo = value.geoJson || [];

    let geometry = null;

    if (geo.length === 1) {
      geometry = {
        type: 'Point',
        coordinates: [geo[0].lng, geo[0].lat],
      };
    } else if (geo.length > 1) {
      geometry = {
        type: 'LineString',
        coordinates: geo.map(pt => [pt.lng, pt.lat]),
      };
    }

    // media를 문자열 키로만 치환
    const media = (value.media || []).map((_, idx) => `media-${key}-${idx}`);

    result.push({
        segmentKey: key,
        order: value.order,
        pointerName: value.pointerName || '',
        difficulty: value.difficulty || '',
        caution: value.caution || '',
        facility: value.facility || [],
        description: value.description || '',
        media, // S3 URL or File
        geometry, // null일 수도 있음
    });

  }

  return result;
}
