/**
 * 사용자단(비회원) > 폰트 어썸 > 아이콘
 * - 임시방편으로 일단 사용하도 나중에  MUI icons 변경하기로 함. 
 * - 추후 SNS아이콘은 사용예정
 *
 * @author kimJS
 * @since 2025.10.22
 * @version 0.1.0
 */
export default function TourismIcons() {
  const iconStyle = { margin: "0 10px", color: "#555", fontSize: "20px" };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 10 }}>
      <FontAwesomeIcon icon={faMapMarkedAlt} style={iconStyle} title="지도" />
      <FontAwesomeIcon icon={faLandmark} style={iconStyle} title="문화유적" />
      <FontAwesomeIcon icon={faMountain} style={iconStyle} title="산/자연" />
      <FontAwesomeIcon icon={faHiking} style={iconStyle} title="트레킹" />
      <FontAwesomeIcon icon={faShoppingBag} style={iconStyle} title="쇼핑" />
      <FontAwesomeIcon icon={faUtensils} style={iconStyle} title="음식" />
      <FontAwesomeIcon icon={faBed} style={iconStyle} title="숙박" />
    </div>
  );
}