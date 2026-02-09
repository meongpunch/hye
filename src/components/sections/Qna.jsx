import { useState } from "react";
import "./Qna.css";

const qaItems = [
  {
    q: "평소 취미는 디자인에 어떻게 이어지나요?",
    a: "일상의 관찰과 기록이 제 디자인의 소재가 됩니다. 평소 사진을 찍고, 일기를 쓰고, 책을 읽는 시간을 통해 일상에서 마주친 장면들을 그냥 지나치지 않고 포착하며 기록합니다. 이렇게 쌓인 작은 관찰들은 제 안에서 하나의 기준이 되고, 이후 디자인할 때 화면의 구조와 흐름을 설계하는 출발점이 됩니다. 저는 작은 장면들을 모아 구조화하고, 그 안에서 감각적인 균형을 찾아내는 방식으로 디자인을 만들어갑니다.",
    imgs: ["/img/qna-q1-1.png", "/img/qna-q1-2.png"],
  },
  {
    q: "비전공자로서 디자인을 이해하기 위해 어떤 노력을 해왔나요?",
    a: "비전공자로서 디자인을 개인적인 감각에 머무르지 않고 구조와 과정으로 이해하려 노력해왔습니다. 타과 전공 UX 설계 수업과 UX/UI 부트캠프를 통해 사용자 리서치부터 문제 정의, 구조 설계까지 UX 설계 프로세스 전반을 익히며 사용자 관점에서 문제를 정의하고 화면으로 구체화하는 실무 경험을 쌓았습니다. 이러한 과정을 통해 단순히 어떤 디자인이 좋은지를 판단하기보다 왜 이 선택이 필요한지, 어떤 기준으로 결정했는지를 설명하는 훈련을 지속해왔고, 그 결과 의사결정의 근거를 구조적으로 설명할 수 있다는 점을 저의 강점으로 갖게 되었습니다.",
    imgs: ["/img//qna-q2-1.png", "/img//qna-q2-2.png"],
  },
  {
    q: "디자인의 기준을 세우는 방식은 무엇인가요?",
    a: "저는 디자인의 기준을 사용자의 실제 선택과 사용 맥락에서 세웁니다. 카카오톡 테마를 직접 제작·판매하며 감각적인 완성도에 더해 가독성과 사용성이 함께 갖춰질 때 사용자의 선택으로 이어진다는 것을 경험했고, 이 경험을 UX/UI 작업에서도 사용자 흐름과 맥락을 기준으로 화면을 설계하는 태도로 확장해왔습니다. 그래서 화면 하나를 설계할 때도 보이는 인상뿐 아니라, 왜 이 구조가 사용자에게 자연스러운지를 먼저 고민하며 디자인의 기준을 세웁니다.",
    imgs: ["/img/qna-q3-1.png", "/img/qna-q3-2.png"],
  },
  {
    q: "협업에서 가장 중요하게 생각하는 점은 무엇인가요?",
    a: "협업에서 가장 중요하게 생각하는 점은 결정의 근거를 공유하며 서로의 언어를 맞추는 과정이라고 생각합니다. 교환학생으로 다양한 문화권의 사람들과 팀 프로젝트를 하며, 각기 다른 관점과 작업 방식을 조율해온 경험이 있습니다. 그 과정에서 의견을 단순히 조정하기보다, 왜 그런 생각이 나왔는지 맥락을 이해하고 공통의 기준을 만드는 데 집중해왔고, 이러한 방식이 협업의 완성도를 높인다고 느꼈습니다.",
    imgs: ["/img/qna-q4-1.png", "/img/qna-q4-2.png"],
  },
  {
    q: "새로운 도구나 기술(AI 등)을 대하는 태도는 어떤가요?",
    a: "새로운 작업 툴을 적극적으로 배우는 편이고, AI 역시 부담 없이 받아들이며 실제 작업에 활용하려는 태도를 가지고 있습니다. 도구 자체를 익히는 데 그치기보다, 제 작업 흐름에서 어떤 부분을 보완해줄 수 있는지부터 고민하고 적용해보며 효율을 높이려 합니다.",
    imgs: ["/img/qna-q5-1.png", "/img/qna-q5-2.png"],
  },
];

export default function Qna() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="qna">
      <div className="qna-inner">
        <div className="qna-left">
          <div className="qna-blob" aria-hidden="true" />
          <h2 className="qna-title">
            <span className="qna-title-main">What</span>{" "}
            <span className="qna-title-italic">Shapes</span>
            <br />
            <span className="qna-title-main">my design :</span>
          </h2>
        </div>

        <div className="qna-right">
          <p className="qna-desc">
            디자인 밖의 시간들이 저를 만들었고,
            <br />그 태도는 디자인 안에서도 그대로 이어집니다.
          </p>
          <ul className="qna-list">
            {qaItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <li
                  key={item.q}
                  className={`qna-item${isOpen ? " is-open" : ""}`}
                >
                  <button
                    type="button"
                    className="qna-question"
                    onClick={() => toggleItem(index)}
                    aria-expanded={isOpen}
                  >
                    <span className="qna-question-text">
                      Q{index + 1}. {item.q}
                    </span>
                    <span className="qna-plus">{isOpen ? "-" : "+"}</span>
                  </button>
                  <div className="qna-answer">
                    <div className="qna-answer-inner">
                      <p>{item.a}</p>
                      <div className="qna-answer-images">
                        {item.imgs.map((src, imgIndex) => (
                          <img
                            key={`${item.q}-${imgIndex}`}
                            src={src}
                            alt="Q&A reference"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
