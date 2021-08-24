// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { MdCheck, MdContentCopy } from "react-icons/md";
import { ImCheckmark } from "react-icons/im";
import BPHTemplate from "./BuildPageHeaderTemplate";
import Tooltip from "../Tooltip";

const ColumnGroup = styled.div`
  flex: 1;

  display: flex;
  gap: 1rem;
`;

const ShareButton = styled(motion.button)`
  /* position: absolute; */

  width: 5rem;
  min-width: 5rem;
  max-width: 5rem;

  height: 5rem;
  min-height: 5rem;
  max-height: 5rem;

  border-radius: 1rem;
  /* border-radius: 50%; */

  background-color: ${({ theme }) => theme.colors.surface.lighter};

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  svg {
    width: 2rem;
    height: 2rem;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const ShareLinkInput = styled.input`
  /* border: 1px dashed red; */

  flex: 1;

  width: 100%;

  font-family: monospace;
  font-style: italic;
  font-size: 1.5rem;
  font-weight: 600;

  padding: 0 1rem;
  background-color: ${({ theme }) => theme.colors.surface.lighter};
  border-radius: 5px;

  color: ${({ theme }) => theme.colors.onSurface.main};
`;

const FlashCheck = styled(motion.div)`
  position: absolute;
  top: 0;
  right: 0;

  margin: 0.5rem 1.5rem;

  padding-right: 0.3rem;
  padding-left: 0.8rem;

  border-radius: 5rem;
  /* min-width: 5rem; */
  width: min-content;
  min-height: 2rem;

  background-color: ${({ theme }) => theme.colors.primary.main};
  /* color: ${({ theme }) => theme.colors.primary.darker}; */
  /* color: rgba(0, 0, 0, 0.9); */
  color: ${({ theme }) => theme.colors.primary.darker};

  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 1px;

  /* white-space: nowrap; */
  text-transform: uppercase;

  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  span {
    width: 1.5rem;
    height: 1.5rem;

    border-radius: 50%;

    background-color: ${({ theme }) => theme.colors.primary.darker};

    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      width: 0.8rem;
      height: 0.8rem;

      path {
        /* fill: rgba(0, 0, 0, 0.9); */
        /* fill: white; */
        fill: ${({ theme }) => theme.colors.primary.main};
      }
    }
  }
`;

const flashAnimProps = {
  variants: {
    show: {
      x: 0,
      opacity: 1,
    },
    hide: {
      x: 300,
      opacity: 0,
    },
  },
  initial: "hide",
  animate: "show",
  exit: "hide",
};

const Flash = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShow(false);
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <FlashCheck {...flashAnimProps}>
      Copied
      <span>
        <ImCheckmark />
      </span>
    </FlashCheck>
  );
  // return <FlashCheck>Copied Successfully!</FlashCheck>;
};

type Props = { link: string };

const ShareLink = ({ link }: Props) => {
  const linkRef = useRef<HTMLInputElement>(null);
  const [show, setShow] = useState(false);
  // const [text, setText] = useState("");

  const copyToClipboard = () => {
    try {
      setShow((v) => !v);

      if (linkRef.current) {
        linkRef.current.focus();
        linkRef.current.select();
        document.execCommand("copy");
      }
    } catch (e) {
      setShow(false);
      console.error(e);
    }
  };
  return (
    <BPHTemplate
      titleLabel={
        <>
          Share Link{" "}
          {
            <Tooltip
              text={`You are not logged in so this link changes whenever you make a change to the build. Your build insights will also not be shared.`}
              label="Share Link Warning"
              iconSize={18}
              textBubbleWidth={300}
            />
          }
        </>
      }
    >
      <>
        <AnimatePresence>
          {show && <Flash show={show} setShow={setShow} />}
        </AnimatePresence>

        <ColumnGroup>
          <ShareLinkInput ref={linkRef} readOnly value={link} />
          <ShareButton
            type="button"
            title="Share Build (copy link to clipboard)"
            onClick={copyToClipboard}
            whileTap={{ scale: 0.8 }}
          >
            <MdContentCopy />
          </ShareButton>
        </ColumnGroup>
      </>
    </BPHTemplate>
  );
};

export default ShareLink;
