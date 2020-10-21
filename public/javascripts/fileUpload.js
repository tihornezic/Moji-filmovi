FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)
FilePond.setOptions({
    stylePanelAspectRatio: 225 / 150,
    imageResizeTargetWidth: 150,
    imageResizeTargetHeight: 225
})
// from filepond github
// parsing all our file input into filepond inputs
// turns all file inputs in our page into filepond inputs
FilePond.parse(document.body);
