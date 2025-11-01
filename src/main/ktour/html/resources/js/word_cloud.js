// 참고 사이트 : https://docs.anychart.com/Basic_Charts/Tag_Cloud

var cloudX = cloudTitle;
var cloudValue = cloudValues;
console.log("x값"+cloudX);
console.log("밸류값"+cloudValue);

anychart.onDocumentReady(function () {
    var data = []
    for (var i = 0; i < cloudX.length; i++) {
        var item = {
            x: cloudX[i],
            value: cloudValue[i],
            link: category3
        };
        data.push(item);
    }
    // var data = [
    //     {x: cloudX[0], value: cloudValue[0], link: "관광"},
    //     {x: cloudX[1], value: cloudValue[1], link: "관광"},
    //     {x: "야호", value: 95, category: "관광"},
    //     {x: "meaning", value: 40, category: "전시"},
    //     {x: "useful", value: 36, category: "자연"},
    //     {x: "different", value: 32, category: "레저"},
    //     {x: "grammar", value: 28, category: "쇼핑"},
    //     {x: "teaching", value: 24, category: "음식"},
    //     {x: "example", value: 20, category: "숙박"},
    //     {x: "thing", value: 12, category: "숙박"},
    //     {x: "example", value: 20, category: "숙박"},
    //     {x: "thing", value: 12, category: "숙박"}
    // ];

    var chart = anychart.tagCloud(data); // create a chart and set the data : 차트 생성
    // chart.angles([0]); // configure angles, 태그 클라우드의 단어 배치 각도를 설정. [0]은 하나의 각도만 사용하도록 설정
    chart.angles([0, 45, -45]);
    // chart.fromAngle(10);
    // chart.toAngle(100);
    // chart.anglesCount(7);
    // chart.angles([0, 30, 90]); // 각도 지정 (0,30,90도 안에서만 나타남)

    chart.textSpacing(3); // set text spacing
    chart.background().fill("transparent"); // 백그라운드 컬러 설정 transparent
    chart.data(data.slice(0, 20)); // 첫 10개 데이터만 사용
    // var customColorScale = anychart.scales.linearColor();  // 색상 스케일 생성 및 구성
    // //var customColorScale = anychart.scales.ordinalColor();
    // customColorScale.colors(["#fff","#fff","#47c947"]);
    // chart.colorScale(customColorScale);
    // 색상 범위 추가 및 구성
    //chart.colorRange().enabled(true);
    //chart.colorRange().length("90%");

    chart.mode("spiral");  // set the mode of the tag cloud : spiral, rect
    //chart.legend(true);   // enable the legend
    // configure tooltips
    chart.tooltip().format("{%yPercentOfTotal}% ({%value})\n\n{%category}");
    chart.normal().fontWeight(600);
    chart.listen("pointClick", function(e){ // 이벤트 리스너 추가, 페이지 링크 연결
        // var url = "https://namu.wiki/w/%EB%82%98%EB%AC%B4%EC%9C%84%ED%82%A4:%EB%8C%80%EB%AC%B8" + e.point.get("x");
        // window.open(url, "_self");
        document.getElementById('hashTag').value = e.point.get("x");
        document.getElementById('hashTagForm').submit();

        // var url = "https://namu.wiki/w/" + encodeURIComponent(e.point.get("x"));
        // window.open(url, "_self");
    });
    chart.animation(true);
    chart.container("word_cloud");  // set the container id, 차트를 그릴 HTML 요소의 ID를 지정합니다.
    chart.draw(); // initiate drawing the chart, 위의 설정들을 기반으로 차트를 그립니다.

    // configure the visual settings of the chart
    // chart.normal().fill("#1fadad");
    // chart.hovered().fill("#93bfec");
    // chart.selected().fill("#1f66ad");
    // chart.normal().stroke("#0f5757");
    // chart.hovered().stroke("#0f3357");
    // chart.selected().stroke("#0f3357");
    //로그 스케일 생성 후 차트의 값 스케일로 설정, 로그 스케일 활용 (Logarithmic Scale):
    //요소들의 빈도가 큰 범위를 다루는 경우, 가장 적게 나타나는 요소들의 폰트 크기는 너무 작아질 수 있습니다. 이러한 상황을 방지하기 위해 로그 스케일을 활용할 수 있습니다.
    tagCloud.scale(anychart.scales.log());
});