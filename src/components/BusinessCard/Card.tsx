import Image from "next/image";

export type TheCardType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  imgSrc: string | null;
  title: string;
  website: string | null;
  slug: string;
  authorId: string;
};

export type CardType = {
  name: string;
  email: string;
  title: string;
  website?: string;
};

const Card = ({
  card,
  isMakeCard = false,
}: {
  card: TheCardType | CardType;
  isMakeCard?: boolean;
}) => {
  /**
   * Credit for this business card design to Joshua Ward
   * https://codepen.io/joshuaward/pen/YMyPWr
   */

  const name = card?.name || "John Doe";
  const title = card?.title || "Business man";
  const email = card?.email || "johndoe@email.com";
  const website = card?.website || "www.thewebsite.com";
  const imgSrc = "";

  const front = `http://localhost:3000/api/og?username=${name}&title=${title}&imgSrc=${imgSrc}`;

  return (
    <div className="card w-34 relative mt-6 h-48 w-[22rem] sm:h-48 sm:w-96">
      {/* Card action buttons*/}
      {!isMakeCard && (
        <div className="hover:opacity-1 bg-slate-400 text-white opacity-0">
          Action buttons
        </div>
      )}

      {/* Back of the card */}

      <div className="card-back">
        <div className="line-numbers">
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
          <div>6</div>
          <div>7</div>
          <div>8</div>
          <div>9</div>
        </div>
        <code>
          <span className="variable">const </span>
          <span className="function">aboutMe </span>
          <span className="operator">= </span>
          <span>{"{"}</span>
          <div className="indent">
            {" "}
            <span className="property">name</span>
            <span className="operator">: </span>
            <span className="string">&#39;{name}&#39;</span>
            <span>,</span>
          </div>
          <div className="indent">
            {" "}
            <span className="property">title</span>
            <span className="operator">: </span>
            <span className="string">&#39;{title}&#39;</span>
            <span>,</span>
          </div>
          <div className="indent">
            {" "}
            <span className="property">contact</span>
            <span className="operator">: </span>
            <span>{"{"}</span>
            <div className="indent">
              {" "}
              <span className="property">email</span>
              <span className="operator">: </span>
              <span className="string">&#39;{email}&#39;</span>
              <span>,</span>
            </div>
            <div className="indent">
              <span className="property">website</span>
              <span className="operator">:</span>
              <span className="string">&#39;{website}&#39;</span>
            </div>
            <span>{"}"}</span>
          </div>
          <span>{"}"}</span>
        </code>
      </div>

      {/* Front of the card */}

      <div className="card-front">
        <Image src={front} alt="Business card" width={480} height={240} />
      </div>
    </div>
  );
};

export default Card;
