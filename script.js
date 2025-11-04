let daftarMenu = [];

const formMenu = document.getElementById("formMenu");
const inputNama = document.getElementById("nama");
const inputHarga = document.getElementById("harga");
const inputDeskripsi = document.getElementById("deskripsi");
const inputFoto = document.getElementById("foto");

//listener ketika form di submit
formMenu.addEventListener("submit", function (e) {
    e.preventDefault(); //supaya halaman tidak di reload

    const nama = inputNama.value.trim();
    const harga = parseFloat(inputHarga.value.trim());
    const deskripsi = inputDeskripsi.value.trim();
    const foto = inputFoto.value.trim();
    
    //validasi input
    if (!nama || isNaN(harga) || harga <= 0) {
        alert("Nama dan harga harus diisi dengan benar!");
        return;
    };
    
    //buat objek menu baru
    let makanan = {
        id: Date.now(),
        nama: nama,
        harga:  harga,
        deskripsi: deskripsi,
        foto: foto,
    };
    
    //tambahkan ke array daftar menu
    daftarMenu.push(makanan);
    renderMenu();
    console.log(daftarMenu);
    
    //reset form
    formMenu.reset();
});

const menuList = document.getElementById('menuList');

function renderMenu() {
    menuList.innerHTML = '';

    daftarMenu.forEach(makanan => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow overflow-hidden flex flex-col';
        
        card.innerHTML = `<img src="${makanan.foto}" alt="${makanan.nama}" class="h-40 w-full object-cover">
        
            <div class="p-3 flex-1">
                <h3 class="font-semibold text-lg">${makanan.nama}</h3>
                <p class="text-sm text-emerald-600">${makanan.deskripsi || '-'}</p>
                <p class="font-bold text-emerald-700 mt-2">Rp${makanan.harga.toLocaleString()}</p>
            </div>
            <button class="bg-emerald-400 text-white py-2 hover:bg-emerald-600">Tambah Pesanan</button>
            `;

        const btn = card.querySelector('button');
        btn.addEventListener('click', () => tambahPesanan(makanan));

        menuList.appendChild(card);
    });
}

let daftarPesanan = [];
const orderList = document.getElementById('orderList');
const totalHarga = document.getElementById('totalHarga');

function tambahPesanan(makanan) {
    const found = daftarPesanan.find(item => item.id === makanan.id);

    if (found) {
        found.jumlah += 1;
    } else {
        daftarPesanan.push({...makanan, jumlah: 1 });
    }

    renderPesanan();
}

function renderPesanan() {
    orderList.innerHTML = '';
    let total = 0;

    daftarPesanan.forEach(item => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center py-2';

        li.innerHTML = `
        <div>
            <p class="font-semibold">${item.nama}</p>
            <p class="text-sm text-gray-500">Rp ${item.harga.toLocaleString()} × ${item.jumlah}</p>
        </div>
        <div class="flex gap-2">
            <button class="bg-emerald-200 hover:bg-emerald-300 text-white px-2 rounded decrease">-</button>
            <button class="bg-emerald-200 hover:bg-emerald-300 text-white px-2 rounded increase">+</button>
            <button class="bg-emerald-400 hover:bg-emerald-500 text-white px-2 rounded delete">Hapus</button>
        </div>
        `;

        //tombol hapus
        li.querySelector('.delete').addEventListener('click', () => hapusPesanan(item.id));

        //tombol tambah kurang
        li.querySelector('.increase').addEventListener('click', () => ubahJumlah(item.id, 1));
        li.querySelector('.decrease').addEventListener('click', () => ubahJumlah(item.id, -1));

        total += item.harga * item.jumlah;
        orderList.appendChild(li);
    });

    totalHarga.textContent = `Total: Rp ${total.toLocaleString()}`;
}

function hapusPesanan(id) {
    daftarPesanan = daftarPesanan.filter(item => item.id !== id);
    renderPesanan();
}

function ubahJumlah(id, delta) {
    const item = daftarPesanan.find(i => i.id === id);
    if (!item) return;

    item.jumlah += delta;
    if (item.jumlah <= 0) {
        hapusPesanan(id);
    } else {
        renderPesanan()
    }
}
