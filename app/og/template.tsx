/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

type OgTemplateProps = {
  title: string
}

export function OgTemplate({ title }: OgTemplateProps) {
  const titleSize = title.length > 72 ? 46 : title.length > 42 ? 62 : 82

  return (
    <div
      style={{
        background: '#FAFAFA',
        color: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Syne',
        height: '100%',
        justifyContent: 'space-between',
        padding: '52px 56px',
        position: 'relative',
        width: '100%',
      }}
    >
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          fontSize: 20,
          fontWeight: 700,
          justifyContent: 'space-between',
          textTransform: 'uppercase',
          width: '100%',
        }}
      >
        <div style={{ alignItems: 'center', display: 'flex' }}>
          <div
            style={{
              background: '#F5FF00',
              border: '4px solid #0A0A0A',
              display: 'flex',
              height: 28,
              marginRight: 14,
              width: 28,
            }}
          />
          Kaan Uzuner
        </div>
        <div style={{ display: 'flex' }}>Founder &amp; Developer</div>
      </div>

      <div
        style={{
          borderBottom: '6px solid #0A0A0A',
          borderTop: '6px solid #0A0A0A',
          display: 'flex',
          padding: '30px 0 34px',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: titleSize,
            fontWeight: 800,
            lineHeight: 0.94,
            maxWidth: 1060,
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          alignItems: 'flex-end',
          display: 'flex',
          fontSize: 18,
          fontWeight: 700,
          justifyContent: 'space-between',
          textTransform: 'uppercase',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex' }}>Product + Web</div>
        <div style={{ display: 'flex' }}>kaanthe.dev / 2026</div>
      </div>
    </div>
  )
}
