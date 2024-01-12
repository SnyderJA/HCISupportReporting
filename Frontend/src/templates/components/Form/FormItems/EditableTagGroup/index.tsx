import { Tag, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FC, useEffect, useRef, useState } from 'react';

type EditableTagGroupType = {
  form: any;
  onChange?: (value: string[]) => void;
  value?: string[];
  formFieldName: string;
};

const EditableTagGroup: FC<EditableTagGroupType> = (props) => {
  const { onChange, value } = props;

  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState();
  const inputRef = useRef<Input>(null);

  useEffect(() => {
    if (tags.length === 0 && value && value.length > 0) {
      setTags(value || []);
    }
  }, [value]);

  useEffect(() => {
    if (!onChange) return;
    onChange(tags);
  }, [tags]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    let newTags = tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      newTags = [...tags, inputValue];
    }
    setTags(newTags);
    setInputVisible(false);
    setInputValue(undefined);
  };

  const forMap = (tag: string) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        {/* <TweenOneGroup
          enter={{
            scale: 0.8,
            opacity: 0,
            type: 'from',
            duration: 100,
          }}
          onEnd={(e: any) => {
            if (e.type === 'appear' || e.type === 'enter') {
              if (e.target) {
                e.target.style = 'display: inline-block';
              }
            }
          }}
          leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
          appear={false}
        > */}
        {tags.map(forMap)}
        {/* </TweenOneGroup> */}
      </div>
      {inputVisible && (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag onClick={showInput} className="site-tag-plus">
          <PlusOutlined /> New Tag
        </Tag>
      )}
    </>
  );
};

export default EditableTagGroup;
