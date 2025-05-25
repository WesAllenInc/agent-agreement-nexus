import{w as J,u as K,e as Q}from"./index-Do9byjsI.js";import{B as X}from"./button-BpiniJQK.js";import"./jsx-runtime-CB_V9I5Y.js";import"./index-CTjT7uj6.js";const te={title:"UI/Button",component:X,parameters:{layout:"centered",docs:{description:{component:"A versatile button component based on Radix UI with various styles and sizes."}},a11y:{config:{rules:[{id:"button-name",enabled:!0},{id:"color-contrast",enabled:!0}]}},backgrounds:{default:"light",values:[{name:"light",value:"#ffffff"},{name:"dark",value:"#1a1a1a"}]},themes:{default:"light",list:[{name:"light",class:"light",color:"#ffffff"},{name:"dark",class:"dark",color:"#1a1a1a"}]}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","destructive","outline","secondary","ghost","link"],description:"The visual style of the button",table:{type:{summary:"string"},defaultValue:{summary:"default"}}},size:{control:"select",options:["default","sm","lg","icon"],description:"The size of the button",table:{type:{summary:"string"},defaultValue:{summary:"default"}}},asChild:{control:"boolean",description:"Whether to render as a child component",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},disabled:{control:"boolean",description:"Whether the button is disabled",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},className:{control:"text",description:"Additional CSS classes",table:{type:{summary:"string"}}},onClick:{action:"clicked"}}},e={args:{children:"Button",variant:"default",size:"default"}},a={args:{children:"Primary Button",variant:"default",size:"default"}},t={args:{children:"Secondary Button",variant:"secondary",size:"default"}},r={args:{children:"Destructive Button",variant:"destructive",size:"default"}},n={args:{children:"Outline Button",variant:"outline",size:"default"}},s={args:{children:"Small Button",variant:"default",size:"sm"}},o={args:{children:"Large Button",variant:"default",size:"lg"}},i={args:{children:"Disabled Button",variant:"default",size:"default",disabled:!0}},c={args:{children:"Ghost Button",variant:"ghost",size:"default"}},l={args:{children:"Link Button",variant:"link",size:"default"}},u={args:{children:"Click Me",variant:"default",size:"default"},play:async({canvasElement:N,args:j})=>{const q=J(N).getByRole("button",{name:/click me/i});await K.click(q),Q(j.onClick).toHaveBeenCalled()}};var d,m,p;e.parameters={...e.parameters,docs:{...(d=e.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default'
  }
}`,...(p=(m=e.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var f,g,h;a.parameters={...a.parameters,docs:{...(f=a.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    children: 'Primary Button',
    variant: 'default',
    size: 'default'
  }
}`,...(h=(g=a.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var v,y,b;t.parameters={...t.parameters,docs:{...(v=t.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    size: 'default'
  }
}`,...(b=(y=t.parameters)==null?void 0:y.docs)==null?void 0:b.source}}};var B,z,k;r.parameters={...r.parameters,docs:{...(B=r.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    children: 'Destructive Button',
    variant: 'destructive',
    size: 'default'
  }
}`,...(k=(z=r.parameters)==null?void 0:z.docs)==null?void 0:k.source}}};var S,C,D;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    children: 'Outline Button',
    variant: 'outline',
    size: 'default'
  }
}`,...(D=(C=n.parameters)==null?void 0:C.docs)==null?void 0:D.source}}};var L,w,x;s.parameters={...s.parameters,docs:{...(L=s.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    children: 'Small Button',
    variant: 'default',
    size: 'sm'
  }
}`,...(x=(w=s.parameters)==null?void 0:w.docs)==null?void 0:x.source}}};var E,O,G;o.parameters={...o.parameters,docs:{...(E=o.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    children: 'Large Button',
    variant: 'default',
    size: 'lg'
  }
}`,...(G=(O=o.parameters)==null?void 0:O.docs)==null?void 0:G.source}}};var I,P,V;i.parameters={...i.parameters,docs:{...(I=i.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    children: 'Disabled Button',
    variant: 'default',
    size: 'default',
    disabled: true
  }
}`,...(V=(P=i.parameters)==null?void 0:P.docs)==null?void 0:V.source}}};var W,A,R;c.parameters={...c.parameters,docs:{...(W=c.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
    size: 'default'
  }
}`,...(R=(A=c.parameters)==null?void 0:A.docs)==null?void 0:R.source}}};var T,H,M;l.parameters={...l.parameters,docs:{...(T=l.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    children: 'Link Button',
    variant: 'link',
    size: 'default'
  }
}`,...(M=(H=l.parameters)==null?void 0:H.docs)==null?void 0:M.source}}};var U,_,F;u.parameters={...u.parameters,docs:{...(U=u.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    children: 'Click Me',
    variant: 'default',
    size: 'default'
  },
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);

    // Find the button
    const button = canvas.getByRole('button', {
      name: /click me/i
    });

    // Click the button
    await userEvent.click(button);

    // Assert that the onClick handler was called
    expect(args.onClick).toHaveBeenCalled();
  }
}`,...(F=(_=u.parameters)==null?void 0:_.docs)==null?void 0:F.source}}};const re=["Default","Primary","Secondary","Destructive","Outline","Small","Large","Disabled","Ghost","Link","WithInteraction"];export{e as Default,r as Destructive,i as Disabled,c as Ghost,o as Large,l as Link,n as Outline,a as Primary,t as Secondary,s as Small,u as WithInteraction,re as __namedExportsOrder,te as default};
