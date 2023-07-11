if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/hp/.gradle/caches/transforms-3/79df068258c60c8c9388280a8b6e9ac0/transformed/jetified-hermes-android-0.71.4-debug/prefab/modules/libhermes/libs/android.x86/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/hp/.gradle/caches/transforms-3/79df068258c60c8c9388280a8b6e9ac0/transformed/jetified-hermes-android-0.71.4-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

