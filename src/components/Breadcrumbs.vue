<template>
    <div :class="$style.breadcrumbs">
        <ul>
            <li>
                <a href="/">Home</a>
            </li>
            <li>
                <span>UI Kit</span>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "Breadcrumbs"
    }
</script>

<style lang="scss" module>
    .breadcrumbs {
        font-size: 11px;
        margin-bottom: 15px;
        color: #959699;
        ul {
            display: flex;
            margin: 0;
            padding: 0;
            list-style-type: none;
        }
        a {
            color: #444;
            text-decoration: none;
        }
    }
</style>