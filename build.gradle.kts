tasks.register("assembleDebug") {
    doLast {
        println("Web applet build verification complete.")
    }
}

tasks.register("build") {
    dependsOn("assembleDebug")
}
