<template>
	<b-menu>
		<b-menu-list label="Menu">
			<b-menu-item icon="information-outline" label="Info"></b-menu-item>
		</b-menu-list>
		<b-menu-list label="Actions">
			<b-menu-item label="Logout"></b-menu-item>
		</b-menu-list>
	</b-menu>
</template>

<script>
	export default {
	  data () {
	    return {
	      isActive: true
	    }
	  }
	}
</script>

<style>

</style>