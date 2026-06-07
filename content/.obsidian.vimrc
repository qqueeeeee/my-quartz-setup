" ── Navigation ──────────────────────────────────────────────────────────────
" wrap-aware j/k
nmap j gj
nmap k gk

" back / forward (browser-style)
exmap back    obcommand app:go-back
exmap forward obcommand app:go-forward
nmap <C-o> :back<CR>
nmap <C-i> :forward<CR>

" ── Links ────────────────────────────────────────────────────────────────────
exmap followLink    obcommand editor:follow-link
exmap followLinkNew obcommand editor:open-link-in-new-leaf
nmap gd  :followLink<CR>
nmap gD  :followLinkNew<CR>

" ── Folding ──────────────────────────────────────────────────────────────────
exmap toggleFold obcommand editor:toggle-fold
nmap za :toggleFold<CR>
nmap zc :toggleFold<CR>
nmap zo :toggleFold<CR>

" ── Leader shortcuts ─────────────────────────────────────────────────────────
" <Space> as leader
let mapleader = " "

exmap quickSwitcher  obcommand switcher:open
exmap search         obcommand global-search:open
exmap commandPalette obcommand command-palette:open
exmap newNote        obcommand file-explorer:new-file
exmap dailyNote      obcommand daily-notes

nmap <leader>f  :quickSwitcher<CR>
nmap <leader>/  :search<CR>
nmap <leader>p  :commandPalette<CR>
nmap <leader>n  :newNote<CR>
nmap <leader>d  :dailyNote<CR>

" ── Pane management ──────────────────────────────────────────────────────────
exmap splitVertical   obcommand workspace:split-vertical
exmap splitHorizontal obcommand workspace:split-horizontal
exmap closePane       obcommand workspace:close
nmap <leader>sv :splitVertical<CR>
nmap <leader>sh :splitHorizontal<CR>
nmap <leader>q  :closePane<CR>

" ── Misc ─────────────────────────────────────────────────────────────────────
" yank to system clipboard
nmap Y "+y
vmap Y "+y

" clear search highlight
nmap <Esc> :nohl<CR>
