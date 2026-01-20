import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';

const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || '');
  const [dimensions, setDimensions] = useState({ width: 250, height: 100 });
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);

  // Extract variables from text (format: {{variableName}})
  useEffect(() => {
    const variableRegex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const foundVariables = [];
    let match;

    while ((match = variableRegex.exec(text)) !== null) {
      const varName = match[1];
      if (!foundVariables.includes(varName)) {
        foundVariables.push(varName);
      }
    }

    setVariables(foundVariables);
  }, [text]);

  // Dynamic sizing based on content
  useEffect(() => {
    if (textareaRef.current) {
      const lines = text.split('\n').length;
      const maxLineLength = Math.max(
        ...text.split('\n').map(line => line.length),
        20
      );

      const newWidth = Math.min(Math.max(250, maxLineLength * 8 + 40), 500);
      const newHeight = Math.min(Math.max(100, lines * 24 + 40), 400);

      setDimensions({ width: newWidth, height: newHeight });
    }
  }, [text]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    if (data?.onChange) {
      data.onChange('text', newText);
    }
  };

  // Calculate handle positions
  const handleStartPosition = 50; // pixels from top
  const handleSpacing = 24; // pixels between handles

  return (
    <div 
      style={{ 
        width: `${dimensions.width}px`,
        minHeight: `${dimensions.height}px`,
        border: '2px solid',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        background: '#eef2ff',
        position: 'relative'
      }}
    >
      {/* VARIABLE HANDLES - LEFT SIDE */}
      {variables.length > 0 ? (
        variables.map((varName, index) => (
          <Handle
            key={`var-${varName}`}
            type="target"
            position={Position.Left}
            id={`${id}-${varName}`}
            style={{
              top: `${handleStartPosition + index * handleSpacing}px`,
              width: '12px',
              height: '12px',
              background: '#3b82f6',
              borderRadius: '50%',
              border: '2px solid white'
            }}
            title={`Input: ${varName}`}
          />
        ))
      ) : (
        // Default input handle if no variables
        <Handle
          type="target"
          position={Position.Left}
          id={`${id}-input`}
          style={{
            width: '12px',
            height: '12px',
            background: '#3b82f6',
            borderRadius: '50%',
            border: '2px solid white'
          }}
          title="Input"
        />
      )}

      {/* OUTPUT HANDLE - RIGHT SIDE */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{
          width: '12px',
          height: '12px',
          background: '#ef4444',
          borderRadius: '50%',
          border: '2px solid white'
        }}
        title="Output"
      />

      {/* Header */}
      <div style={{
        background: 'linear-gradient(to right, #6366f1, #3b82f6)',
        color: 'white',
        padding: '8px 16px',
        borderTopLeftRadius: '6px',
        borderTopRightRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ fontSize: '18px' }}>📝</span>
        <span style={{ fontWeight: '600', fontSize: '14px' }}>Text</span>
      </div>

      {/* Variable Info */}
      {variables.length > 0 && (
        <div style={{
          padding: '8px 16px',
          background: '#e0e7ff',
          borderBottom: '1px solid #c7d2fe'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '500', color: '#4338ca', marginBottom: '4px' }}>
            Variables Detected:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {variables.map((varName, idx) => (
              <span 
                key={idx}
                style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  background: '#c7d2fe',
                  color: '#3730a3',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontFamily: 'monospace'
                }}
              >
                {varName}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Text Input Area */}
      <div style={{ padding: '16px' }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text here... Use {{variableName}} to create dynamic inputs"
          style={{
            width: '100%',
            height: `${dimensions.height - 80}px`,
            minHeight: '60px',
            padding: '12px',
            fontSize: '14px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            outline: 'none',
            fontFamily: 'monospace',
            resize: 'none'
          }}
        />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
          Tip: Use {`{{variableName}}`} to create input handles
        </div>
      </div>
    </div>
  );
};

export default TextNode;


// import React, { useState, useEffect, useRef } from 'react';

// const TextNode = ({ id, data }) => {
//   const [text, setText] = useState(data?.text || '');
//   const [dimensions, setDimensions] = useState({ width: 250, height: 100 });
//   const [variables, setVariables] = useState([]);
//   const textareaRef = useRef(null);

//   // Extract variables from text (format: {{variableName}})
//   useEffect(() => {
//     const variableRegex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
//     const foundVariables = [];
//     let match;

//     while ((match = variableRegex.exec(text)) !== null) {
//       const varName = match[1];
//       if (!foundVariables.includes(varName)) {
//         foundVariables.push(varName);
//       }
//     }

//     setVariables(foundVariables);
//   }, [text]);

//   // Dynamic sizing based on content
//   useEffect(() => {
//     if (textareaRef.current) {
//       const lines = text.split('\n').length;
//       const maxLineLength = Math.max(
//         ...text.split('\n').map(line => line.length),
//         20
//       );

//       const newWidth = Math.min(Math.max(250, maxLineLength * 8 + 40), 500);
//       const newHeight = Math.min(Math.max(100, lines * 24 + 40), 400);

//       setDimensions({ width: newWidth, height: newHeight });
//     }
//   }, [text]);

//   const handleTextChange = (e) => {
//     const newText = e.target.value;
//     setText(newText);
//     if (data?.onChange) {
//       data.onChange('text', newText);
//     }
//   };

//   return (
//     <div 
//       className="bg-indigo-50 border-indigo-400"
//       style={{ 
//         width: `${dimensions.width}px`,
//         minHeight: `${dimensions.height}px`,
//         border: '2px solid',
//         borderRadius: '8px',
//         boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//         background: '#eef2ff'
//       }}
//     >
//       {/* Header */}
//       <div style={{
//         background: 'linear-gradient(to right, #6366f1, #3b82f6)',
//         color: 'white',
//         padding: '8px 16px',
//         borderTopLeftRadius: '6px',
//         borderTopRightRadius: '6px',
//         display: 'flex',
//         alignItems: 'center',
//         gap: '8px'
//       }}>
//         <span style={{ fontSize: '18px' }}>📝</span>
//         <span style={{ fontWeight: '600', fontSize: '14px' }}>Text</span>
//       </div>

//       {/* Variable Info */}
//       {variables.length > 0 && (
//         <div style={{
//           padding: '8px 16px',
//           background: '#e0e7ff',
//           borderBottom: '1px solid #c7d2fe'
//         }}>
//           <div style={{ fontSize: '12px', fontWeight: '500', color: '#4338ca', marginBottom: '4px' }}>
//             Variables Detected:
//           </div>
//           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
//             {variables.map((varName, idx) => (
//               <span 
//                 key={idx}
//                 style={{
//                   display: 'inline-block',
//                   padding: '2px 8px',
//                   background: '#c7d2fe',
//                   color: '#3730a3',
//                   borderRadius: '4px',
//                   fontSize: '11px',
//                   fontFamily: 'monospace'
//                 }}
//               >
//                 {varName}
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Text Input Area */}
//       <div style={{ padding: '16px' }}>
//         <textarea
//           ref={textareaRef}
//           value={text}
//           onChange={handleTextChange}
//           placeholder="Enter text here... Use {{variableName}} to create dynamic inputs"
//           style={{
//             width: '100%',
//             height: `${dimensions.height - 80}px`,
//             minHeight: '60px',
//             padding: '12px',
//             fontSize: '14px',
//             border: '1px solid #d1d5db',
//             borderRadius: '4px',
//             outline: 'none',
//             fontFamily: 'monospace',
//             resize: 'none'
//           }}
//         />
//         <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
//           Tip: Use {`{{variableName}}`} to create input handles
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TextNode;