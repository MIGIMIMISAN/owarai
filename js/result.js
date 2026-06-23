"use strict";

// ============================
// 全回答を取得
// ============================
function getAllAnswers() {
    let result = {};
    for (let i = 1; i <= 6; i++) {
        const raw = localStorage.getItem("question" + i);
        if (raw) Object.assign(result, JSON.parse(raw));
    }
    return result;
}

// ============================
// 平均計算
// ============================
function average(answers, keys) {
    let sum = 0, count = 0;
    for (const k of keys) {
        const v = Number(answers[k]);
        if (!isNaN(v)) { sum += v; count++; }
    }
    return count === 0 ? 0 : sum / count;
}

// ============================
// タイプ判定
// 出力順：P/S → N/A → I/B → O/C
// ============================
function calculateType(answers) {
    // 1軸 P/S：高得点=P（パワー）、低得点=S（センス）
    // P寄り質問：q2(ノリで押し切る), q10(雑でも勢い), q22(声量で空気を変える)
    // S寄り質問：q5(言葉遊び), q13(独自の世界観), q18(文章だけで面白い)
    // ※S寄り質問は反転（6-値）してP軸に統一
    const PS_raw = average(answers, ["q2", "q10", "q22"]);
    const PS_inv = average(answers, ["q5", "q13", "q18"]);
    const PS = (PS_raw + (6 - PS_inv)) / 2;
    const first = PS >= 3 ? "P" : "S";

    // 2軸 N/A：高得点=A（アクト）、低得点=N（ナチュラル）
    // A寄り質問：q1(演技が好き), q7(別人格の方が笑える), q16(ギャップに驚かれる)
    // N寄り質問：q11(普段の自分をそのまま), q19(演技中も変わらない), q23(自分の体験談)
    const NA_raw = average(answers, ["q1", "q7", "q16"]);
    const NA_inv = average(answers, ["q11", "q19", "q23"]);
    const NA = (NA_raw + (6 - NA_inv)) / 2;
    const second = NA >= 3 ? "A" : "N";

    // 3軸 I/B：高得点=I（瞬発）、低得点=B（ビルド）
    // I寄り質問：q4(急に振られても発揮), q17(にぎやかし大喜利), q21(70%を連発)
    // B寄り質問：q8(この人がやった方がウケると思う), q12(伏線・構成が好き), q15(整理してから話す)
    const IB_raw = average(answers, ["q4", "q17", "q21"]);
    const IB_inv = average(answers, ["q8", "q12", "q15"]);
    const IB = (IB_raw + (6 - IB_inv)) / 2;
    const third = IB >= 3 ? "I" : "B";

    // 4軸 O/C：高得点=C（秩序）、低得点=O（混沌）
    // C寄り質問：q3(傷つける笑いNG), q20(周囲を見て役割を考える), q24(ルールの中でボケる)
    // O寄り質問：q6(その場で笑いが取れればよい), q9(包み隠さず言う), q14(身内ノリが好き)
    const OC_raw = average(answers, ["q3", "q20", "q24"]);
    const OC_inv = average(answers, ["q6", "q9", "q14"]);
    const OC = (OC_raw + (6 - OC_inv)) / 2;
    const fourth = OC >= 3 ? "C" : "O";

    return first + second + third + fourth;
}

// ============================
// 16タイプ全定義
// ============================
const resultData = {
    PNIO: { title: "直感ムードメーカー型",     text: "空気を読まずに読む天才。勢いと本能で笑いを量産する、現場の太陽。" },
    PNIC: { title: "パワフル秩序型",           text: "声が大きくてルールも守る。場をまとめつつ笑いを引っ張る兄貴・姉貴タイプ。" },
    PNBO: { title: "直感設計型",               text: "自然体に見えて実は計算している。構成力と勢いを兼ね備えたオールラウンダー。" },
    PNBC: { title: "戦略ナチュラル型",         text: "落ち着いた外見の裏に設計図がある。笑いを仕組みで作る縁の下の力持ち。" },
    PAIO: { title: "爆発アクター型",           text: "キャラと勢いで全てを持っていく。舞台を支配する圧倒的存在感の持ち主。" },
    PAIC: { title: "カリスマ演者型",           text: "しっかり演じてしっかり笑わせる。場を壊さずに盛り上げる信頼の演技派。" },
    PABO: { title: "演技派クリエイター型",     text: "キャラを作って構成で仕留める。独自路線で客の心をつかむ職人肌。" },
    PABC: { title: "完全設計型",               text: "演技・構成・秩序すべてを揃えた完成型。計算された笑いを完璧に届ける。" },
    SNIO: { title: "センス瞬発型",             text: "言葉のセンスと即興力で光る。一言で会場の温度を変える天才肌。" },
    SNIC: { title: "センス安定型",             text: "言葉のセンスがあって場も読める。安心して任せられるクレバーな笑い職人。" },
    SNBO: { title: "感性設計型",               text: "独特な感性をじっくり練り上げる。唯一無二の世界観で笑いを生み出すタイプ。" },
    SNBC: { title: "精密センス型",             text: "センスと構成と秩序が三位一体。緻密に設計された笑いを届ける完成形。" },
    SAIO: { title: "即興アクター型",           text: "その場でキャラを作り笑いを生む。予測不能な動きで観客を翻弄する自由人。" },
    SAIC: { title: "安定演技型",               text: "しっかりしたキャラと秩序感で笑わせる。信頼できるクレバーな演者タイプ。" },
    SABO: { title: "世界観アクター型",         text: "キャラと世界観で独自の空気を作る。一度見たら忘れられない個性派。" },
    SABC: { title: "構造分析エリート型",       text: "演技・構成・秩序・センスを全て持つ理想形。完璧に設計された笑いを届ける頂点。" },
};

// ============================
// 表示
// ============================
const answers = getAllAnswers();
const type = calculateType(answers);

document.getElementById("typeCode").textContent = type;

if (resultData[type]) {
    document.getElementById("typeName").textContent = resultData[type].title;
    document.getElementById("description").textContent = resultData[type].text;
} else {
    document.getElementById("typeName").textContent = "未定義タイプ";
    document.getElementById("description").textContent = "タイプ定義が見つかりません：" + type;
}

// ============================
// シェア機能
// ============================
function shareResult() {
    const title = resultData[type]?.title || type;
    const text = `私のお笑いステータス診断は「${type}（${title}）」でした！`;
    const url = "https://migimimisan.github.io/owarai/";
    window.open(
        "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent(text) + "&url=" + encodeURIComponent(url),
        "_blank"
    );
}

// ============================
// デバッグ
// ============================
console.log("RESULT DEBUG:", { type, answers });
