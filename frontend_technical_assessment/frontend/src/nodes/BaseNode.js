import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

const BaseNode = ({ id, data, config = {} }) => {
  const {
    label = 'Node',
    description = '',
    fields = [],
    icon = '📦',
    // color = 'bg-white',
    // borderColor = 'border-gray-300'
  } = config;

  const [fieldValues, setFieldValues] = useState(
    fields.reduce((acc, field) => ({ 
      ...acc, 
      [field.name]: field.defaultValue || '' 
    }), {})
  );

  const handleFieldChange = (fieldName, value) => {
    setFieldValues(prev => ({ ...prev, [fieldName]: value }));
    if (data?.onChange) {
      data.onChange(fieldName, value);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={fieldValues[field.name]}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            style={{
              width: '100%',
              padding: '6px 8px',
              fontSize: '14px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              outline: 'none'
            }}
          />
        );
      case 'textarea':
        return (
          <textarea
            value={fieldValues[field.name]}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            style={{
              width: '100%',
              padding: '6px 8px',
              fontSize: '14px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
        );
      case 'select':
        return (
          <select
            value={fieldValues[field.name]}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            style={{
              width: '100%',
              padding: '6px 8px',
              fontSize: '14px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              outline: 'none'
            }}
          >
            {field.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      border: '2px solid',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      minWidth: '200px',
      maxWidth: '300px',
      position: 'relative'
    }}>
      {/* INPUT HANDLE - LEFT SIDE */}
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
      />

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
      />

      {/* Header */}
      <div style={{
        background: 'linear-gradient(to right, #3b82f6, #a855f7)',
        color: 'white',
        padding: '8px 16px',
        borderTopLeftRadius: '6px',
        borderTopRightRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ fontSize: '18px' }}>{icon}</span>
        <span style={{ fontWeight: '600', fontSize: '14px' }}>{label}</span>
      </div>

      {/* Description */}
      {description && (
        <div style={{
          padding: '8px 16px',
          fontSize: '12px',
          color: '#4b5563',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          {description}
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '16px' }}>
        {fields.map((field, idx) => (
          <div key={idx} style={{ marginBottom: idx < fields.length - 1 ? '12px' : '0' }}>
            {field.label && (
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '4px'
              }}>
                {field.label}
              </label>
            )}
            {renderField(field)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BaseNode;



// import React, { useState } from 'react';

// const BaseNode = ({ id, data, config = {} }) => {
//   const {
//     label = 'Node',
//     description = '',
//     fields = [],
//     icon = '📦',
//     color = 'bg-white',
//     borderColor = 'border-gray-300'
//   } = config;

//   const [fieldValues, setFieldValues] = useState(
//     fields.reduce((acc, field) => ({ 
//       ...acc, 
//       [field.name]: field.defaultValue || '' 
//     }), {})
//   );

//   const handleFieldChange = (fieldName, value) => {
//     setFieldValues(prev => ({ ...prev, [fieldName]: value }));
//     if (data?.onChange) {
//       data.onChange(fieldName, value);
//     }
//   };

//   const renderField = (field) => {
//     switch (field.type) {
//       case 'text':
//         return (
//           <input
//             type="text"
//             value={fieldValues[field.name]}
//             onChange={(e) => handleFieldChange(field.name, e.target.value)}
//             placeholder={field.placeholder}
//             style={{
//               width: '100%',
//               padding: '6px 8px',
//               fontSize: '14px',
//               border: '1px solid #d1d5db',
//               borderRadius: '4px',
//               outline: 'none'
//             }}
//           />
//         );
//       case 'textarea':
//         return (
//           <textarea
//             value={fieldValues[field.name]}
//             onChange={(e) => handleFieldChange(field.name, e.target.value)}
//             placeholder={field.placeholder}
//             rows={field.rows || 3}
//             style={{
//               width: '100%',
//               padding: '6px 8px',
//               fontSize: '14px',
//               border: '1px solid #d1d5db',
//               borderRadius: '4px',
//               outline: 'none',
//               fontFamily: 'inherit'
//             }}
//           />
//         );
//       case 'select':
//         return (
//           <select
//             value={fieldValues[field.name]}
//             onChange={(e) => handleFieldChange(field.name, e.target.value)}
//             style={{
//               width: '100%',
//               padding: '6px 8px',
//               fontSize: '14px',
//               border: '1px solid #d1d5db',
//               borderRadius: '4px',
//               outline: 'none'
//             }}
//           >
//             {field.options?.map(opt => (
//               <option key={opt.value} value={opt.value}>{opt.label}</option>
//             ))}
//           </select>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className={`${color} ${borderColor}`} style={{
//       border: '2px solid',
//       borderRadius: '8px',
//       boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//       minWidth: '200px',
//       maxWidth: '300px'
//     }}>
//       {/* Header */}
//       <div style={{
//         background: 'linear-gradient(to right, #3b82f6, #a855f7)',
//         color: 'white',
//         padding: '8px 16px',
//         borderTopLeftRadius: '6px',
//         borderTopRightRadius: '6px',
//         display: 'flex',
//         alignItems: 'center',
//         gap: '8px'
//       }}>
//         <span style={{ fontSize: '18px' }}>{icon}</span>
//         <span style={{ fontWeight: '600', fontSize: '14px' }}>{label}</span>
//       </div>

//       {/* Description */}
//       {description && (
//         <div className="bg-gray-50" style={{
//           padding: '8px 16px',
//           fontSize: '12px',
//           color: '#4b5563',
//           borderBottom: '1px solid #e5e7eb'
//         }}>
//           {description}
//         </div>
//       )}

//       {/* Content */}
//       <div style={{ padding: '16px' }}>
//         {fields.map((field, idx) => (
//           <div key={idx} style={{ marginBottom: idx < fields.length - 1 ? '12px' : '0' }}>
//             {field.label && (
//               <label style={{
//                 display: 'block',
//                 fontSize: '12px',
//                 fontWeight: '500',
//                 color: '#374151',
//                 marginBottom: '4px'
//               }}>
//                 {field.label}
//               </label>
//             )}
//             {renderField(field)}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BaseNode;