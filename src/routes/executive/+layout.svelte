<script>
	import { ChartNoAxesColumn, HeartHandshake, Home, Link, LucideUsers, MessageCircleMoreIcon, User, UserCog, Users } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import PwaInstallPrompt from '../../components/PWAInstallPrompt.svelte';

    let {children} = $props();
</script>
<title>Executive | NWU Vaal GKSS </title>

<div class="flex min-h-screen w-full bg-gradient-to-b from-white to-gray-200 lg:p-1 justify-between">
    <ul class="menu bg-base-200 rounded-box w-56 min-h-[90svh] hidden lg:flex">
        <li class="menu-title flex bg-gray-800 text-white rounded-box my-2">
            <div>
                <h2>Lethabo Maepa</h2>
                <p>Tech and innovation lead</p>
            </div>
        </li>
        <li>
          <a href="/executive">
            <Home/>
            Home
          </a>
        </li>
        <li>
          <a href="/executive/events">
            <ChartNoAxesColumn/>
            Event Management
          </a>
        </li>
        <li>
            <a href="/executive/team">
              <UserCog/>
              Executive Team
            </a>
          </li>
        <li>
          <a href="/executive/membership">
            <Users/>
            Members
          </a>
        </li>
        <li>
            <a href="/executive/">
              <HeartHandshake/>
              Sponsors
            </a>
          </li>
        <li>
            <li>
                <details open>
                  <summary><Link/>Other links</summary>
                  <ul>
                    <li>
                        <a data-sveltekit-reload href="/dashboard">
                        <User/>
                        Dashboard
                        </a>
                    </li>
                    <li>
                        <a data-sveltekit-reload href="/community">
                        <MessageCircleMoreIcon/>
                        Community
                        </a>
                    </li>
                  </ul>
                </details>
        
        </li>
      </ul>
      <div in:slide={{ x: 100 }} out:slide={{ x: -100 }} class="w-full lg:[width:calc(100%-224px)]">
        {@render children()}
      </div>
</div>
