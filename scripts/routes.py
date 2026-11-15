"""Public paths shared by metadata generation and the static build."""


def page_path(filename):
    if filename == 'index.html':
        return ''
    if filename == '404.html':
        return filename
    return filename.removesuffix('.html') + '/'
