---
layout: post
title: Java - 基础：集合框架
categories: Java
keywords: [java, collection]
date: 2021-03-08 22:22:22
image: /images/wallpaper/java_basic_collections.jpg
lang: java
search: true
qrcode: true
catalogue: true
prism: true
description: Java 内置了一系列非常基础而强大的数据结构。
---

### PriorityQueue

优先队列。Java 的优先队列使用平衡二叉堆实现，堆的顺序默认由元素的自然顺序决定，也可以由构造参数决定，默认是小根堆。同时 `PriorityQueue` 是非同步的队列，因此无法保证线程安全。

1. 采用数组来实现堆。

    ~~~java
    transient Object[] queue; // non-private to simplify nested class access
    ~~~

2. 堆的默认大小为 11。

    构造方法可以指定堆大小，该大小仅仅是初始化时内部 `Object` 数组的大小，一旦堆空间不足，则会进行扩容。

    ~~~java
    private static final int DEFAULT_INITIAL_CAPACITY = 11;
    public PriorityQueue() {
        this(DEFAULT_INITIAL_CAPACITY, null);
    }
    ~~~

3. 如果未指定排序规则，则使用元素的自然顺序进行排序。支持自然顺序排序的元素必须实现 `Comparable` 接口，以便将元素向上转型为 `Comparable` 实例，再调用 `Comparable::compareTo()` 方法进行比较。  
如果指定排序规则，则需在构造参数中传入 `Comparator` 实例，排序时调用 `Comparator::compare(a, b)` 方法进行比较。

    因此，如果对象未实现 `Comparable` 接口，并且未传入 `Comparator` 对象，则在比较时会抛出 `ClassCastException`。

    ~~~java
    private final Comparator<? super E> comparator;
    // 上浮操作
    private void siftUp(int k, E x) {
        if (comparator != null)
            siftUpUsingComparator(k, x);
        else
            siftUpComparable(k, x);
    }
    
    private void siftUpComparable(int k, E x) {
        Comparable<? super E> key = (Comparable<? super E>) x;
        while (k > 0) {
            int parent = (k - 1) >>> 1;
            Object e = queue[parent];
            if (key.compareTo((E) e) >= 0)
                break;
            queue[k] = e;
            k = parent;
        }
        queue[k] = key;
    }
    
    private void siftUpUsingComparator(int k, E x) {
        while (k > 0) {
            int parent = (k - 1) >>> 1;
            Object e = queue[parent];
            if (comparator.compare(x, (E) e) >= 0)
                break;
            queue[k] = e;
            k = parent;
        }
        queue[k] = x;
    }
    ~~~

4. 堆的基础操作

    * 构造：通过对最后一个父节点向根节点开始逐个下沉，构造出堆。

        ~~~java
        private void heapify() {
            for (int i = (size >>> 1) - 1; i >= 0; i--)
                siftDown(i, (E) queue[i]);
        }
        ~~~

    * 插入：每次插入元素将元素置于尾部，通过上浮修正堆。

        ~~~java
        public boolean offer(E e) {
            if (e == null)
                throw new NullPointerException();
            modCount++; // 记录堆的修改次数
            int i = size;
            if (i >= queue.length)
                grow(i + 1);
            size = i + 1;
            if (i == 0)
                queue[0] = e;
            else
                siftUp(i, e);
            return true;
        }
        ~~~

    * 取出：移除堆顶元素，将数组最后一个元素置于堆顶，并进行下沉操作。

        ~~~java
        public E poll() {
            if (size == 0)
                return null;
            int s = --size;
            modCount++;
            E result = (E) queue[0];
            E x = (E) queue[s];
            queue[s] = null;
            if (s != 0)
                siftDown(0, x);
            return result;
        }
        ~~~

5. 扩容

    当元素数量小于 64 时，翻倍增加 50%。当元素数量大于 64 时，每次扩容容量加 2。  
    如果扩容后容量会超过 `MAX_ARRAY_SIZE`，即 `Integer.MAX_VALUE - 8`，则判断目前要求最小容量是否超出 `MAX_ARRAY_SIZE`，是则容量直接改为 `Integer.MAX_VALUE`，否则不扩容。

    ~~~java
    public boolean offer(E e) {
        // ...
        int i = size;
        if (i >= queue.length)
            grow(i + 1);
        // ... 
    }

    private void grow(int minCapacity) {
        int oldCapacity = queue.length;
        // Double size if small; else grow by 50%
        int newCapacity = oldCapacity + 
            ((oldCapacity < 64) ? (oldCapacity + 2) : (oldCapacity >> 1));
        // overflow-conscious code
        if (newCapacity - MAX_ARRAY_SIZE > 0)
            newCapacity = hugeCapacity(minCapacity);
        queue = Arrays.copyOf(queue, newCapacity);
    }

    private static int hugeCapacity(int minCapacity) {
        if (minCapacity < 0) // overflow
            throw new OutOfMemoryError();
        return (minCapacity > MAX_ARRAY_SIZE) ?
            Integer.MAX_VALUE :
            MAX_ARRAY_SIZE;
    }
    ~~~

6. 序列化

    优先队列可以通过 `ObjectOutputStream` 序列化输出，输出的同时会保留内部元素和长度信息。

    ~~~java
    private void writeObject(java.io.ObjectOutputStream s) throws java.io.IOException {
        // Write out element count, and any hidden stuff
        s.defaultWriteObject();

        // Write out array length, for compatibility with 1.5 version
        s.writeInt(Math.max(2, size + 1));

        // Write out all elements in the "proper order".
        for (int i = 0; i < size; i++)
            s.writeObject(queue[i]);
    }
    ~~~