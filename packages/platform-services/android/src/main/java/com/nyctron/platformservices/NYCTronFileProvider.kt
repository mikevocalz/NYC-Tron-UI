package com.nyctron.platformservices

import androidx.core.content.FileProvider

/**
 * The kit's own FileProvider subclass, so its manifest entry never collides
 * with a FileProvider the host app declares. Serves the app's cache and files
 * directories (res/xml/nyctron_file_paths.xml) to apps a share is granted to.
 */
class NYCTronFileProvider : FileProvider()
