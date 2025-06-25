import React from "react";
import Select from "react-select";
import {
  ObservatoryIcon,
  StoreIcon,
  ParkingIcon,
  InfoIcon,
  RestroomIcon,
  ShelterIcon,
  WaterFountainIcon,
  MapBoardIcon,
  AedIcon,
  PhotoSpotIcon,
  SummitIcon,
  DescentPathIcon,
  DangerZoneIcon,
} from "./icons"; // 아이콘 export 한 파일

const facilityOptions = [
  { value: "observatory", label: "전망대", icon: ObservatoryIcon },
  { value: "store", label: "편의점", icon: StoreIcon },
  { value: "parking", label: "주차장", icon: ParkingIcon },
  { value: "info", label: "안내소", icon: InfoIcon },
  { value: "restroom", label: "화장실", icon: RestroomIcon },
  { value: "shelter", label: "정자/쉼터", icon: ShelterIcon },
  { value: "water", label: "급수대", icon: WaterFountainIcon },
  { value: "mapboard", label: "종합안내도", icon: MapBoardIcon },
  { value: "aed", label: "AED", icon: AedIcon },
  { value: "photo", label: "사진명소", icon: PhotoSpotIcon },
  { value: "summit", label: "정상", icon: SummitIcon },
  { value: "descent", label: "하산길", icon: DescentPathIcon },
  { value: "danger", label: "위험구간", icon: DangerZoneIcon },
];

// 아이콘 포함 커스텀 렌더링
const formatOptionLabel = ({ label, icon }) => (
  <div className="flex items-center gap-2">
    {icon}
    <span>{label}</span>
  </div>
);



export default function FacilitySelector({ selected, setSelected }) {
  // selected = ["store", "parking"] 와 같은 string 배열
  const selectedOptions = facilityOptions.filter(opt => selected.includes(opt.value));

  return (
    <div className="w-full mt-4">
      <label className="block mb-2 font-medium text-gray-700">주요시설</label>
      <Select
        isMulti
        options={facilityOptions}
        value={selectedOptions}
        onChange={(options) => {
          const values = options.map(opt => opt.value);
          setSelected(values);
        }}
        formatOptionLabel={formatOptionLabel}
        placeholder="시설 검색"
        className="text-sm"
        styles={{
          control: (base) => ({ ...base, minHeight: '42px' }),
          multiValue: (base) => ({ ...base, backgroundColor: '#f3f4f6' }),
        }}
      />
    </div>
  );
}
