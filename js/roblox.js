document.addEventListener('DOMContentLoaded', function() {
    const sFE = document.getElementById('searchForm');
    const lE = document.getElementById('loading');
    const eE = document.getElementById('error');
    const eME = document.getElementById('errorMessage');
    const pCE = document.getElementById('profileContainer');
    
    const cLE = document.getElementById('copyLink');

    const dNE = document.getElementById('displayName');
    const uDE = document.getElementById('usernameDisplay');
    const uIE = document.getElementById('userId'); 
    const jDE = document.getElementById('joinDate'); 
    const aE = document.getElementById('avatar');
    const pLE = document.getElementById('profileLink');
    const pBE = document.getElementById('premiumBadge');
    const dE = document.getElementById('description');
    const fCE = document.getElementById('friendCount');
    const foCE = document.getElementById('followerCount');
    const flCE = document.getElementById('followingCount');

    const uLME = document.getElementById('userListModal');
    const uLTE = document.getElementById('userListTitle');
    const uLCE = document.getElementById('userListContent');
    const cULMBE = document.getElementById('closeUserListModalBtn');

    function fN(n) {
        return n.toLocaleString('en-US');
    }

    if (cLE) {
        cLE.addEventListener('click', function() {
            const pL = pLE ? pLE.href : '';
            
            const tA = document.createElement('textarea');
            tA.value = pL;
            document.body.appendChild(tA);
            tA.select();
            document.execCommand('copy');
            document.body.removeChild(tA);

            const oT = cLE.innerHTML;
            cLE.innerHTML = '<i class="fas fa-check mr-2"></i> Copied';
            cLE.disabled = true;
            setTimeout(() => {
                cLE.innerHTML = oT;
                cLE.disabled = false;
            }, 2000);
        });
    }
    
    if (sFE) {
        sFE.addEventListener('submit', function(ev) {
            ev.preventDefault();
            const u = document.getElementById('username').value.trim();
            
            if (!u) {
                sE('Enter a username.');
                return;
            }
            
            if (lE) lE.classList.remove('hidden');
            if (eE) eE.classList.remove('show'); 
            if (pCE) pCE.classList.add('hidden');
            
            fRP(u);
        });
    }
    
    let cUI = null;

    async function fRP(u) {
        try {
            const res = await fetch(`https://api.foul.sh/profile/${u}`);
            
            if (!res.ok) {
                let eT = await res.text(); 
                try {
                    const eJ = JSON.parse(eT); 
                    eT = eJ.error || eT;
                } catch (pE) {
                }
                throw new Error(eT || 'Failed to fetch profile data from proxy.');
            }
            
            let d;
            try {
                d = await res.json(); 
            } catch (jPE) {
                const rR = await res.text();
                throw new Error('Proxy returned invalid data. Is the backend server running and configured correctly?');
            }

            const { pD, frD, foD, flD, bD, aU } = d; 

            if (lE) lE.classList.add('hidden');
            
            cUI = pD.id; 
            dP(pD, frD, foD, flD, bD, aU);
        } catch (er) {
            if (lE) lE.classList.add('hidden');
            sE(er.message || 'Failed to fetch profile data. Try again.');
        }
    }
    
    function displayBadges(badgesData) { 
        const bC = document.getElementById('badgesContainer');
        if (!bC) { 
            return;
        }
        bC.innerHTML = '';

        if (!badgesData || badgesData.length === 0) {
            bC.innerHTML = `
                <div class="w-full text-center py-4">
                    <p class="text-zinc-500">No badges to display.</p>
                </div>
            `;
            return;
        }

        badgesData.forEach(b => {
            const bE = document.createElement('div');
            bE.className = 'badge-item';
            bE.innerHTML = `
                <img src="${b.imageUrl || 'https://placehold.co/150x150/333333/ffffff?text=No+Badge+Image'}" 
                    alt="${b.name}"
                    onerror="this.onerror=null;this.src='https://placehold.co/150x150/333333/ffffff?text=No+Badge+Image';">
                <p>${b.name}</p>
            `;
            bC.appendChild(bE);
        });
    }

    function dP(pD, frD, foD, flD, bD, aU) {
        if (dNE) dNE.textContent = pD.displayName || pD.name;
        if (uDE) {
            const s = uDE.querySelector('span');
            if (s) s.textContent = pD.name;
        }
        if (uIE) uIE.textContent = pD.id;
        if (jDE) jDE.textContent = new Date(pD.created).toLocaleDateString();
        
        if (aE) aE.src = aU || 'https://www.roblox.com/img/avatar/default_128x128.png';
        if (pLE) pLE.href = `https://www.roblox.com/users/${pD.id}/profile`;
        
        if (pBE) {
            if (pD.hasVerifiedBadge) {
                pBE.classList.remove('hidden');
            } else {
                pBE.classList.add('hidden'); 
            }
        }
        
        if (dE) {
            if (pD.description && pD.description.trim() !== '') {
                dE.textContent = pD.description;
            } else {
                dE.textContent = 'No description provided.';
            }
        }

        if (fCE) fCE.textContent = fN(frD ? frD.count || 0 : 0);
        if (foCE) foCE.textContent = fN(foD ? foD.count || 0 : 0);
        if (flCE) flCE.textContent = fN(flD ? flD.count || 0 : 0);
        
        displayBadges(bD);
        
        if (pCE) pCE.classList.remove('hidden');
    }
    
    function sE(m) {
        if (eME) eME.textContent = m;
        if (eE) {
            eE.classList.add('show');
        }
        
        setTimeout(() => {
            if (eE) {
                eE.classList.remove('show');
            }
        }, 5000);
    }

    if (cULMBE) {
        cULMBE.addEventListener('click', closeUserListModal);
    }
    if (uLME) {
        uLME.addEventListener('click', (e) => {
            if (e.target === uLME) {
                closeUserListModal();
            }
        });
    }

    function openUserListModal(title, users) {
        if (uLTE) uLTE.textContent = title;
        if (uLCE) uLCE.innerHTML = ''; 

        if (!users || users.length === 0) {
            if (uLCE) uLCE.innerHTML = '<p class="text-zinc-400 text-center py-4">No users found.</p>';
        } else {
            users.forEach(user => {
                const lI = document.createElement('div');
                lI.className = 'user-list-item';
                lI.innerHTML = `
                    <img src="${user.avatarUrl || 'https://www.roblox.com/img/avatar/default_128x128.png'}" alt="${user.displayName || user.name}">
                    <a href="https://www.roblox.com/users/${user.id}/profile" target="_blank">
                        <span>${user.displayName || user.name}</span>
                    </a>
                `;
                if (uLCE) uLCE.appendChild(lI);
            });
        }
        if (uLME) uLME.classList.add('show');
    }

    function closeUserListModal() {
        if (uLME) uLME.classList.remove('show');
    }

    const fSCE = document.getElementById('friendStatCard');
    const foSCE = document.getElementById('followerStatCard');
    const flSCE = document.getElementById('followingStatCard');

    if (fSCE) {
        fSCE.addEventListener('click', async () => {
            if (!cUI) {
                sE('Search for a user first.');
                return;
            }
            try {
                const res = await fetch(`https://api.foul.sh/friends/${cUI}`);
                if (!res.ok) {
                    const eD = await res.json();
                    throw new Error(eD.error || 'Failed to fetch friends list.');
                }
                const d = await res.json();
                openUserListModal('Friends', d.users);
            } catch (e) {
                sE(e.message || 'Failed to load friends list.');
            }
        });
    }

    if (foSCE) {
        foSCE.addEventListener('click', async () => {
            if (!cUI) {
                sE('Search for a user first.');
                return;
            }
            try {
                const res = await fetch(`https://api.foul.sh/followers/${cUI}`);
                if (!res.ok) {
                    const eD = await res.json();
                    throw new Error(eD.error || 'Failed to fetch followers list.');
                }
                const d = await res.json();
                openUserListModal('Followers', d.users);
            } catch (e) {
                sE(e.message || 'Failed to load followers list.');
            }
        });
    }

    if (flSCE) {
        flSCE.addEventListener('click', async () => {
            if (!cUI) {
                sE('Search for a user first.');
                return;
            }
            try {
                const res = await fetch(`https://api.foul.sh/following/${cUI}`);
                if (!res.ok) {
                    const eD = await res.json();
                    throw new Error(eD.error || 'Failed to fetch following list.');
                }
                const d = await res.json();
                openUserListModal('Following', d.users);
            } catch (e) {
                sE(e.message || 'Failed to load following list.');
            }
        });
    }
});
