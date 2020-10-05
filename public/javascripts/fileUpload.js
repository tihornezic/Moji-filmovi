FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)
FilePond.setOptions({
    stylePanelAspectRatio: 150 / 100,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150
})
// from filepond github
// parsing all our file input into filepond inputs
// turns all file inputs in our page into filepond inputs
FilePond.parse(document.body);
