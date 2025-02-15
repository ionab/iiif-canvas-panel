import React from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackCodeEditor,
  SandpackStack,
  SandpackProps,
  githubLightTheme,
  SandpackProviderProps, CodeEditorProps, PreviewProps, ClasserProvider, SandpackThemeProvider
} from "@codesandbox/sandpack-react";
import useThemeContext from '@theme/hooks/useThemeContext';

export function Sandbox(_props: { stacked?: boolean; project: SandpackProps } & SandpackProps) {
  const { isDarkTheme } = useThemeContext();
  const { project, ...props } = _props;

  const options = { editorHeight: 540, ...project.options, ...props.options };

  return <CustomSandpack theme={isDarkTheme ? 'dark' : {
    ...githubLightTheme,
    palette: {
      ...githubLightTheme.palette,
      defaultBackground: 'rgb(246, 248, 250)'
    },
    typography: {
      monoFont: 'SFMono-Regular, Menlo, Monaco, Consolas, \'Liberation Mono\', \'Courier New\', monospace',
    },
  }}  {...project} {...props} options={options} />
}


export function CustomSandpack(props: SandpackProps & { stacked?: boolean }) {
    // Combine files with customSetup to create the user input structure
    const userInputSetup = props.files
      ? {
        ...props.customSetup,
        files: {
          ...props.customSetup?.files,
          ...props.files,
        },
      }
      : props.customSetup;

    const previewOptions: PreviewProps = {
      showNavigator: props.options?.showNavigator,
    };

    const codeEditorOptions: CodeEditorProps = {
      showTabs: props.options?.showTabs,
      showLineNumbers: props.options?.showLineNumbers,
      showInlineErrors: props.options?.showInlineErrors,
      wrapContent: props.options?.wrapContent,
      closableTabs: props.options?.closableTabs,
      initMode: props.options?.initMode,
      extensions: props.options?.codeEditor?.extensions,
      extensionsKeymap: props.options?.codeEditor?.extensionsKeymap,
      readOnly: props.options?.readOnly,
      showReadOnly: props.options?.showReadOnly,
    };

    const providerOptions: SandpackProviderProps = {
      openPaths: props.options?.openPaths,
      activePath: props.options?.activePath,
      recompileMode: props.options?.recompileMode,
      recompileDelay: props.options?.recompileDelay,
      autorun: props.options?.autorun ?? true,
      bundlerURL: props.options?.bundlerURL,
      startRoute: props.options?.startRoute,
      skipEval: props.options?.skipEval,
      fileResolver: props.options?.fileResolver,
      initMode: props.options?.initMode,
      initModeObserverOptions: props.options?.initModeObserverOptions,
      externalResources: props.options?.externalResources,
    };

    // Parts are set as `flex` values, so they set the flex shrink/grow
    // Cannot use width percentages as it doesn't work with
    // the automatic layout break when the component is under 700px
    const editorPart = props.options?.editorWidthPercentage || 50;
    const previewPart = 100 - editorPart;
    const editorHeight = props.options?.editorHeight;

    const Layout = props.stacked ? SandpackStack : SandpackLayout;

    return (
      <SandpackProvider
        customSetup={userInputSetup}
        template={props.template}
        {...providerOptions}
      >
        <ClasserProvider classes={props.options?.classes}>
          <SandpackThemeProvider theme={props.theme}>
            <Layout>
              <SandpackCodeEditor
                {...codeEditorOptions}
                customStyle={{
                  height: props.stacked ? undefined : editorHeight,
                  flexGrow: editorPart,
                  flexShrink: editorPart,
                  minWidth: 700 * (editorPart / (previewPart + editorPart)),
                }}
              />
              <SandpackPreview
                {...previewOptions}
                customStyle={{
                  height: editorHeight,
                  flexGrow: previewPart,
                  flexShrink: previewPart,
                  width: props.stacked ? '100%' : undefined,
                  minWidth: 700 * (previewPart / (previewPart + editorPart)),
                }}
              />
            </Layout>
          </SandpackThemeProvider>
        </ClasserProvider>
      </SandpackProvider>
    );

}


export function parseFiles(req: any) {
  return req.keys().reduce((state, key) => {
    if (key.indexOf('_load') !== -1) {
      return state;
    }

    return {
      ...state,
      [key.slice(1)]: req(key).default,
    };
  }, {});
}
